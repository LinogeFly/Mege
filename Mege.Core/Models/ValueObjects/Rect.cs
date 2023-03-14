namespace Mege.Core.Models.ValueObjects;

public struct Rect
{
    public int Top { get; init; }
    public int Left { get; init; }
    public int Height { get; init; }
    public int Width { get; init; }

    public Rect(int top, int left, int height, int width)
    {
        // TODO: Replace with fluent validation

        if (top < 0)
            throw new ArgumentException();

        if (left < 0)
            throw new ArgumentException();

        if (height < 0)
            throw new ArgumentException();

        if (width < 0)
            throw new ArgumentException();

        this.Top = top;
        this.Left = left;
        this.Height = height;
        this.Width = width;
    }
}
