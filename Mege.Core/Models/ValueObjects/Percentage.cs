namespace Mege.Core.Models.ValueObjects;

public struct Percentage
{
    public Percentage(int value)
    {
        // TODO: Replace with fluent validation

        if (value < 0)
            throw new ArgumentException();

        if (value > 100)
            throw new ArgumentException();

        Value = value;
    }

    public int Value { get; private set; }
}