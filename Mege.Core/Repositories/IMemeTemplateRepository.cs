using Mege.Core.Models.Entities;

namespace Mege.Core.Repositories
{
    public interface IMemeTemplateRepository
    {
        Task<MemeTemplate?> GetById(int id);
        Task<MemeTemplate?> GetByUrlName(string urlName);
        Task<IEnumerable<MemeTemplate>> GetPage(int page, string? search);
        Task<MemeTemplate> Add(MemeTemplate item);
        Task<MemeTemplate> Update(MemeTemplate item);
        Task Delete(int id);
    }
}