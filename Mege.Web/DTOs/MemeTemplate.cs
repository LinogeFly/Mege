namespace Mege.Web.DTOs;

public sealed class MemeTemplate
{
    public int Id { get; init; }
    public string Name { get; init; } = "";
    public string Url { get; init; } = "";
    public IEnumerable<MemeTemplateTextLine> TextLines { get; init; } = new List<MemeTemplateTextLine>();
    public MemeTemplateSpacing? Spacing { get; set; }
}
