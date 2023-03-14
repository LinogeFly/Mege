namespace Mege.Core.Models.Entities;

public sealed class MemeTemplate
{
    public int Id { get; init; }
    public string Name { get; init; } = "";
    public byte[] Image { get; init; } = null!;
    public IEnumerable<MemeTemplateTextLine> TextLines { get; set; } = new List<MemeTemplateTextLine>();
    public MemeTemplateSpacing? Spacing { get; set; }
}
