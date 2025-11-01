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
    }
}
