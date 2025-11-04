using Backend.DTOs.Portfolio;

namespace Backend.Services.Interfaces
{
    public interface IPortfolioService
    {
        Task<PortfolioDto?> GetByIdAsync(int id);
        Task<IEnumerable<PortfolioDto>> GetByUserIdAsync(string userId);
        Task<IEnumerable<PortfolioDto>> GetAllAsync(int page, int pageSize);
        Task<int> GetTotalCountAsync();
        Task<int> GetCountByUserIdAsync(string userId);
        Task<PortfolioDto> CreateAsync(string userId, CreatePortfolioDto createDto);
        Task<bool> UpdateAsync(int id, string userId, UpdatePortfolioDto updateDto);
        Task<bool> DeleteAsync(int id, string userId);
        Task<PortfolioDetailDto?> GetDetailByIdAsync(int id, string userId);
        Task<PortfolioStatsDto?> GetPortfolioStatsAsync(int id, string userId);
        Task<List<PortfolioSummaryDto>> GetUserPortfolioSummariesAsync(string userId);
        Task<bool> CanDeleteAsync(int id, string userId);
        Task<bool> IsInUseAsync(int id);
        Task<int> GetInvestmentCountAsync(int id);
        Task<PortfolioDto> GetOrCreateDefaultPortfolioAsync(string userId);
    }
}
