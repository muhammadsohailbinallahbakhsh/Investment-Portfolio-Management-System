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

        /// <summary>
        /// Get portfolio detail with investments and statistics
        /// </summary>
        Task<PortfolioDetailDto?> GetDetailByIdAsync(int id, string userId);

        /// <summary>
        /// Get portfolio statistics (for dashboard/charts)
        /// </summary>
        Task<PortfolioStatsDto?> GetPortfolioStatsAsync(int id, string userId);

        /// <summary>
        /// Get user's portfolios in summary format (for dropdowns/cards)
        /// </summary>
        Task<List<PortfolioSummaryDto>> GetUserPortfolioSummariesAsync(string userId);

        /// <summary>
        /// Check if portfolio can be deleted (has no investments)
        /// </summary>
        Task<bool> CanDeleteAsync(int id, string userId);

        /// <summary>
        /// Check if portfolio is in use (has investments)
        /// </summary>
        Task<bool> IsInUseAsync(int id);

        /// <summary>
        /// Get investment count for a portfolio
        /// </summary>
        Task<int> GetInvestmentCountAsync(int id);
    }
}
