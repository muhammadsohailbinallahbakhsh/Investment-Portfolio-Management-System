using Backend.Models;
using static Backend.AppCode.AppConstants;

namespace Backend.Repositories.Interfaces
{
    public interface IInvestmentRepository
    {
        Task<Investment?> GetByIdAsync(int id);
        Task<IEnumerable<Investment>> GetByUserIdAsync(string userId, int page, int pageSize);
        Task<IEnumerable<Investment>> GetByPortfolioIdAsync(int portfolioId, int page, int pageSize);
        Task<IEnumerable<Investment>> GetAllAsync(int page, int pageSize);

        Task<int> GetTotalCountAsync();
        Task<int> GetCountByUserIdAsync(string userId);

        Task<decimal> GetTotalValueAsync();
        Task<decimal> GetTotalValueByUserIdAsync(string userId);

        Task<Investment> CreateAsync(Investment investment);
        Task<bool> UpdateAsync(Investment investment);
        Task<bool> SoftDeleteAsync(int id);

        Task<IEnumerable<Investment>> SearchAsync(
            string? searchTerm,
            InvestmentType? type,
            InvestmentStatus? status,
            DateTime? startDate,
            DateTime? endDate);
    }
}
