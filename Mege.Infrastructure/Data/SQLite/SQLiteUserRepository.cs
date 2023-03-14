using Mege.Core.Models.Entities;
using Mege.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Mege.Infrastructure.Data.SQLite;

public class SQLiteUserRepository : IUserRepository
{
    private readonly SQLiteDbContext dbContext;

    public SQLiteUserRepository(SQLiteDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<User> AddUser(User user)
    {
        if (string.IsNullOrEmpty(user.Password))
            throw new InvalidOperationException("Password can't be empty");

        var newUser = dbContext.Users.Add(new PersistedUser
        {
            Email = user.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password)
        });

        await dbContext.SaveChangesAsync();

        return Map(newUser.Entity);
    }

    public async Task<User?> GetByEmail(string email)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(user => user.Email.ToLower() == email.ToLower());

        if (user == null)
            return null;

        return Map(user);
    }

    public async Task<bool> IsValid(string email, string password)
    {
        var existingUser = await dbContext.Users.SingleOrDefaultAsync(user => user.Email.ToLower() == email.ToLower());

        if (existingUser == null)
            return false;

        return BCrypt.Net.BCrypt.Verify(password, existingUser.PasswordHash);
    }

    private User Map(PersistedUser user)
    {
        return new User
        {
            Id = user.Id,
            Email = user.Email
        };
    }
}