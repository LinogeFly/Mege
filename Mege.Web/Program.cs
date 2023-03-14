using System.Text.Json;
using System.Text.Json.Serialization;
using Mege.Core.Repositories;
using Mege.Infrastructure.Data.SQLite;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
//
builder.Services
    .AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        opt.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
        );
    });
//
builder.Services.AddDbContext<SQLiteDbContext>(opt => opt.UseSqlite("Data Source=Mege.sqlite.db;"));
builder.Services.AddScoped<IMemeTemplateRepository, SQLiteMemeTemplateRepository>();
builder.Services.AddScoped<IUserRepository, SQLiteUserRepository>();
//
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(opt =>
    {
        opt.Cookie.MaxAge = TimeSpan.FromDays(28);
        opt.ExpireTimeSpan = TimeSpan.FromDays(14);
        opt.SlidingExpiration = true;
        opt.Events.OnRedirectToLogin = (context) =>
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
    });

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddLog4Net("log4net.config");

var app = builder.Build();

// Apply Entity Framework migrations
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SQLiteDbContext>();
    context.Database.Migrate();
}

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();
