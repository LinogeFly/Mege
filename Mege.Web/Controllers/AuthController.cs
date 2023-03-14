using System.Security.Claims;
using Mege.Core.Repositories;
using Mege.Web.DTOs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DomainUser = Mege.Core.Models.Entities.User;

namespace Mege.Web.Controllers;

[ApiController]
[Route("api")]
public class AuthController : ControllerBase
{
    private readonly ILogger log;
    private readonly IConfiguration configuration;
    private readonly IUserRepository repository;

    public AuthController(
        ILogger<AuthController> log,
        IConfiguration configuration,
        IUserRepository repository)
    {
        this.log = log;
        this.configuration = configuration;
        this.repository = repository;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(NewUserRequest request)
    {
        if (IsRegistrationDisabled)
            return BadRequest("Registration of new users is disabled.");

        var newUser = Map(request);

        await repository.AddUser(newUser);

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var isValid = await repository.IsValid(request.Email, request.Password);
        if (!isValid)
            return BadRequest("Invalid credentials.");

        var user = (await repository.GetByEmail(request.Email))!;

        var claimsIdentity = new ClaimsIdentity(new List<Claim> {
            new Claim(ClaimTypes.Name, user.Email)
        }, CookieAuthenticationDefaults.AuthenticationScheme);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            new AuthenticationProperties());

        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        return Ok();
    }

    [Authorize]
    [HttpGet("user")]
    public async Task<ActionResult<LoggedInUser>> GetLoggedInUser()
    {
        var email = HttpContext.User.Identity?.Name;

        if (string.IsNullOrEmpty(email))
            return BadRequest();

        var user = await repository.GetByEmail(email);

        if (user == null)
            return BadRequest();

        return Ok(Map(user));
    }

    private bool IsRegistrationDisabled => configuration.GetValue("FeatureToggles:DisableRegistration", false);

    private LoggedInUser Map(DomainUser user)
    {
        return new LoggedInUser
        {
            Email = user.Email
        };
    }

    private DomainUser Map(NewUserRequest newUser)
    {
        return new DomainUser
        {
            Password = newUser.Password,
            Email = newUser.Email
        };
    }

    private DomainUser Map(LoginRequest request)
    {
        return new DomainUser
        {
            Password = request.Password,
            Email = request.Email
        };
    }
}
