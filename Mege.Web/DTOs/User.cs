using System.ComponentModel.DataAnnotations;

namespace Mege.Web.DTOs;

public sealed class LoggedInUser
{
    public string Email { get; init; } = "";
}

public sealed class NewUserRequest
{
    [Required]
    public string Email { get; init; } = "";

    [Required]
    public string Password { get; init; } = "";
}

public sealed class LoginRequest
{
    [Required]
    public string Email { get; init; } = "";

    [Required]
    public string Password { get; init; } = "";
}