using Mege.Core.Models.ValueObjects;

namespace Mege.Core.Models.Entities;

public sealed class MemeTemplateTextLine
{
    public string Text { get; init; } = "";
    public string Color { get; init; } = "#000000";
    public Rect Rect { get; init; } = new Rect(0, 0, 100, 200);
}
