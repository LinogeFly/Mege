using System.ComponentModel.DataAnnotations;
using Mege.Core.Models.Entities;

namespace Mege.Web.DTOs;

public sealed class MemeTemplateSpacing
{
    public string Color { get; set; } = "#ffffff";
    public MemeTemplateSpacingType Type { get; set; }

    [Range(0, 100)]
    public int Size { get; set; }
}