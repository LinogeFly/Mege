using Mege.Core.Models.ValueObjects;

namespace Mege.Core.Models.Entities;

public sealed class MemeTemplateSpacing
{
    public string Color { get; set; } = "#ffffff";
    public MemeTemplateSpacingType Type { get; set; }
    public Percentage Size { get; set; }
}

public enum MemeTemplateSpacingType
{
    None,
    Top,
    TopAndBottom,
    Bottom
}