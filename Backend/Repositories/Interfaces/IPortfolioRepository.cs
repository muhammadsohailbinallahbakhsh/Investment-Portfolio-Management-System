using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IPortfolioRepository
    {
        Task<Portfolio?> GetByIdAsync(int id);
        Task<IEnumerable<Portfolio>> GetByUserIdAsync(string userId);
        Task<IEnumerable<Portfolio>> GetAllAsync(int page, int pageSize);

        Task<int> GetTotalCountAsync();
        Task<int> GetCountByUserIdAsync(string userId);

        Task<Portfolio> CreateAsync(Portfolio portfolio);
        Task<bool> UpdateAsync(Portfolio portfolio);
        Task<bool> SoftDeleteAsync(int id);
    }
}
