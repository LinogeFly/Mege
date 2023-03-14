using Mege.Core.Models.Entities;
using Mege.Core.Models.ValueObjects;
using Mege.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Mege.Infrastructure.Data.SQLite;

public class SQLiteMemeTemplateRepository : IMemeTemplateRepository
{
    private readonly SQLiteDbContext dbContext;

    public SQLiteMemeTemplateRepository(SQLiteDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<MemeTemplate?> GetById(int id)
    {
        var item = await dbContext.MemeTemplates
            .Include(m => m.TextLines)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (item == null)
            return null;

        return Map(item);
    }

    public async Task<MemeTemplate?> GetByUrlName(string urlName)
    {
        return await Task.FromException<MemeTemplate>(new NotImplementedException());
    }

    public async Task<IEnumerable<MemeTemplate>> GetPage(int page, string? search)
    {
        const int pageSize = 20;

        var items = await dbContext.MemeTemplates
            .Where(m => string.IsNullOrEmpty(search) || EF.Functions.Like(m.Name, $"%{search}%"))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return items.Select(Map);
    }

    public async Task<MemeTemplate> Add(MemeTemplate newItem)
    {
        var newPersistedItem = new PersistedMemeTemplate
        {
            Name = newItem.Name,
            Image = newItem.Image
        };
        var addedMemeTemplate = dbContext.MemeTemplates.Add(newPersistedItem);

        await dbContext.SaveChangesAsync();

        return Map(addedMemeTemplate.Entity);
    }

    public async Task<MemeTemplate> Update(MemeTemplate newItem)
    {
        var persistedItem = await dbContext.MemeTemplates
            .Include(m => m.TextLines)
            .FirstOrDefaultAsync(m => m.Id == newItem.Id);

        if (persistedItem == null)
            throw new Exception($"Meme template with ID '{newItem.Id}' was not found.");

        persistedItem.Name = newItem.Name;
        persistedItem.TextLines = Map(newItem.TextLines);
        persistedItem.SpacingColor = newItem.Spacing != null ? newItem.Spacing.Color : "";
        persistedItem.SpacingType = newItem.Spacing != null ? Map(newItem.Spacing.Type) : PersistedMemeTemplateSpacingType.None;
        persistedItem.SpacingSize = newItem.Spacing != null ? newItem.Spacing.Size.Value : 0;

        await dbContext.SaveChangesAsync();

        return Map(persistedItem);
    }

    public async Task Delete(int id)
    {
        var item = await dbContext.MemeTemplates.FindAsync(id);

        if (item == null)
            throw new Exception($"Meme template with ID '{id}' was not found.");

        dbContext.MemeTemplates.Remove(item);

        await dbContext.SaveChangesAsync();
    }

    private MemeTemplate Map(PersistedMemeTemplate memeTemplate)
    {
        return new MemeTemplate
        {
            Id = memeTemplate.Id,
            Name = memeTemplate.Name,
            Image = memeTemplate.Image,
            TextLines = memeTemplate.TextLines.Select(line => new MemeTemplateTextLine
            {
                Text = line.Text,
                Color = line.Color,
                Rect = new Rect(line.Top, line.Left, line.Height, line.Width)
            }),
            Spacing = MapSpacing(memeTemplate)
        };
    }

    private MemeTemplateSpacing? MapSpacing(PersistedMemeTemplate memeTemplate)
    {
        if (memeTemplate.SpacingSize == 0)
            return null;

        return new MemeTemplateSpacing
        {
            Color = memeTemplate.SpacingColor,
            Type = Map(memeTemplate.SpacingType),
            Size = new Percentage(memeTemplate.SpacingSize)
        };
    }

    private List<PersistedMemeTemplateTextLine> Map(IEnumerable<MemeTemplateTextLine> lines)
    {
        return lines
            .Select(line => new PersistedMemeTemplateTextLine
            {
                Text = line.Text,
                Color = line.Color,
                Top = line.Rect.Top,
                Left = line.Rect.Left,
                Height = line.Rect.Height,
                Width = line.Rect.Width
            })
            .ToList();
    }

    private PersistedMemeTemplateSpacingType Map(MemeTemplateSpacingType spacingType)
    {
        switch (spacingType)
        {
            case MemeTemplateSpacingType.Top:
                return PersistedMemeTemplateSpacingType.Top;
            case MemeTemplateSpacingType.TopAndBottom:
                return PersistedMemeTemplateSpacingType.TopAndBottom;
            case MemeTemplateSpacingType.Bottom:
                return PersistedMemeTemplateSpacingType.Bottom;
            default:
                return PersistedMemeTemplateSpacingType.None;
        }
    }

    private MemeTemplateSpacingType Map(PersistedMemeTemplateSpacingType spacingType)
    {
        switch (spacingType)
        {
            case PersistedMemeTemplateSpacingType.Top:
                return MemeTemplateSpacingType.Top;
            case PersistedMemeTemplateSpacingType.TopAndBottom:
                return MemeTemplateSpacingType.TopAndBottom;
            case PersistedMemeTemplateSpacingType.Bottom:
                return MemeTemplateSpacingType.Bottom;
            default:
                return MemeTemplateSpacingType.None;
        }
    }
}