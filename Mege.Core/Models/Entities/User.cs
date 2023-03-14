namespace Mege.Core.Models.Entities;

public sealed class User
{
    public int Id { get; init; }
    public string Email { get; init; } = "";
    public string? Password { get; init; }
}
