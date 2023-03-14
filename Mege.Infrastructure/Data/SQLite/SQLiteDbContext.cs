using Microsoft.EntityFrameworkCore;

namespace Mege.Infrastructure.Data.SQLite;

public class SQLiteDbContext : DbContext
{
    public DbSet<PersistedMemeTemplate> MemeTemplates { get; set; } = null!;
    public DbSet<PersistedUser> Users { get; set; } = null!;

    public SQLiteDbContext(DbContextOptions<SQLiteDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PersistedMemeTemplate>()
            .ToTable("MemeTemplates");

        modelBuilder.Entity<PersistedMemeTemplateTextLine>()
            .ToTable("MemeTemplateTextLines")
            .Property<int>("PersistedMemeTemplateId").HasColumnName("MemeTemplateId");

        modelBuilder.Entity<PersistedUser>()
            .ToTable("Users")
            .HasIndex(u => u.Email)
            .IsUnique();
    }

    private byte[] GetImage(string name)
    {
        return File.ReadAllBytes($"Static/MemeTemplates/{name}");
    }
}
