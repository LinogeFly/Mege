namespace Mege.Infrastructure.Data.SQLite;

public sealed class PersistedMemeTemplate
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public byte[] Image { get; set; } = null!;
    public List<PersistedMemeTemplateTextLine> TextLines { get; set; } = new List<PersistedMemeTemplateTextLine>();
    public string SpacingColor { get; set; } = "";
    public PersistedMemeTemplateSpacingType SpacingType { get; set; }
    public int SpacingSize { get; set; }
}

public sealed class PersistedMemeTemplateTextLine
{
    public int Id { get; set; }
    public string Text { get; set; } = "";
    public string Color { get; set; } = "#000000";
    public int Top { get; set; }
    public int Left { get; set; }
    public int Height { get; set; }
    public int Width { get; set; }
}

public sealed class PersistedUser
{
    public int Id { get; set; }
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
}

public enum PersistedMemeTemplateSpacingType
{
    None,
    Top,
    TopAndBottom,
    Bottom
}