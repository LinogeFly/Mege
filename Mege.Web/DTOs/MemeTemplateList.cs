namespace Mege.Web.DTOs;

public sealed class MemeTemplateList
{
    public bool IsLastPage { get; set; }
    public IEnumerable<MemeTemplateListItem> MemeTemplates { get; set; } = new List<MemeTemplateListItem>();
}

public sealed class MemeTemplateListItem
{
    public int Id { get; init; }
    public string Name { get; init; } = "";
}