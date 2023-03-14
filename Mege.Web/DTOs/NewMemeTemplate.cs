using System.ComponentModel.DataAnnotations;

namespace Mege.Web.DTOs;

public sealed class NewMemeTemplateRequest
{
    [Required]
    public string Name { get; init; } = "";

    [Required]
    public IFormFile Image { get; init; } = null!;
}

public sealed class NewMemeTemplate
{
    public int Id { get; init; }
}