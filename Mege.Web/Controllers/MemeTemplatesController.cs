using Mege.Core.Repositories;
using Mege.Web.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DomainMemeTemplate = Mege.Core.Models.Entities.MemeTemplate;
using DomainMemeTemplateTextLine = Mege.Core.Models.Entities.MemeTemplateTextLine;
using DomainMemeTemplateSpacing = Mege.Core.Models.Entities.MemeTemplateSpacing;
using Mege.Core.Models.ValueObjects;

namespace Mege.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MemeTemplatesController : ControllerBase
{
    private readonly ILogger log;
    private readonly IMemeTemplateRepository repository;

    public MemeTemplatesController(
        IMemeTemplateRepository repository,
        ILogger<MemeTemplatesController> log)
    {
        this.repository = repository;
        this.log = log;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MemeTemplate>> GetById(int id)
    {
        var memeTemplate = await repository.GetById(id);

        if (memeTemplate == null)
            return NotFound();

        return Map(memeTemplate);
    }

    [HttpGet]
    public async Task<ActionResult<MemeTemplateList>> GetPage(int? page, string? search = "")
    {
        var pageNumber = page ?? 1;

        var requestedPageTask = repository.GetPage(pageNumber, search);
        var nextPageTask = repository.GetPage(pageNumber + 1, search);
        var (requestedPage, nextPage) = (await requestedPageTask, await nextPageTask);

        return new MemeTemplateList
        {
            MemeTemplates = requestedPage.Select(MapListItem),
            IsLastPage = nextPage.Count() == 0
        };
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<NewMemeTemplate>> Add([FromForm] NewMemeTemplateRequest request)
    {
        var newMemeTemplate = await Map(request);
        var addedMemeTemplate = await repository.Add(newMemeTemplate);

        return new NewMemeTemplate
        {
            Id = addedMemeTemplate.Id
        };
    }

    [Authorize]
    [HttpPost("batch")]
    public async Task<IActionResult> AddMany([FromForm] NewMemeTemplateRequest request, int count)
    {
        for (int i = 0; i < count; i++)
        {
            var newMemeTemplate = await Map(request);
            await repository.Add(newMemeTemplate);
        }

        return Content($"Added {count} new meme template clones.");
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<MemeTemplate>> Update(UpdateMemeTemplateRequest request)
    {
        var newMemeTemplate = Map(request);

        var updatedMemeTemplate = await repository.Update(newMemeTemplate);

        return Map(updatedMemeTemplate);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var memeTemplate = await repository.GetById(id);

        if (memeTemplate == null)
            return NotFound();

        await repository.Delete(id);

        return Ok();
    }

    private MemeTemplate Map(DomainMemeTemplate item)
    {
        return new MemeTemplate
        {
            Id = item.Id,
            Name = item.Name,
            Url = $"/api/memetemplateimages/{item.Id}",
            TextLines = item.TextLines.Select(line => new MemeTemplateTextLine
            {
                Text = line.Text,
                Color = line.Color,
                Rect = line.Rect
            }),
            Spacing = MapSpacing(item)
        };
    }

    private MemeTemplateListItem MapListItem(DomainMemeTemplate item)
    {
        return new MemeTemplateListItem
        {
            Id = item.Id,
            Name = item.Name,
        };
    }

    private MemeTemplateSpacing? MapSpacing(DomainMemeTemplate item)
    {
        if (item.Spacing == null)
            return null;

        return new MemeTemplateSpacing
        {
            Color = item.Spacing.Color,
            Size = item.Spacing.Size.Value,
            Type = item.Spacing.Type
        };
    }

    private async Task<DomainMemeTemplate> Map(NewMemeTemplateRequest item)
    {
        using (var memoryStream = new MemoryStream())
        {
            await item.Image.CopyToAsync(memoryStream);

            return new DomainMemeTemplate
            {
                Name = item.Name,
                Image = memoryStream.ToArray()
            };
        }
    }

    private DomainMemeTemplate Map(UpdateMemeTemplateRequest item)
    {
        return new DomainMemeTemplate
        {
            Id = item.Id,
            Name = item.Name,
            TextLines = item.TextLines.Select(line => new DomainMemeTemplateTextLine
            {
                Text = line.Text,
                Color = line.Color,
                Rect = line.Rect
            }),
            Spacing = Map(item.Spacing)
        };
    }

    private DomainMemeTemplateSpacing? Map(MemeTemplateSpacing? spacing)
    {
        if (spacing == null)
            return null;

        return new DomainMemeTemplateSpacing
        {
            Color = spacing.Color,
            Type = spacing.Type,
            Size = new Percentage(spacing.Size)
        };
    }
}
