using Mege.Core.Models.Entities;

namespace Mege.Core.Repositories
{
    public interface IUserRepository
    {
        public Task<User> AddUser(User user);
        public Task<User?> GetByEmail(string email);
        public Task<bool> IsValid(string email, string password);
    }
}