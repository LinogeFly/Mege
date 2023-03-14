using System.ComponentModel.DataAnnotations;

namespace Mege.Web.DTOs;

public sealed class UpdateMemeTemplateRequest
{
    [Required]
    public int Id { get; init; }

    [Required]
    public string Name { get; init; } = "";

    public IEnumerable<MemeTemplateTextLine> TextLines { get; init; } = new List<MemeTemplateTextLine>();
    public MemeTemplateSpacing? Spacing { get; set; }
}