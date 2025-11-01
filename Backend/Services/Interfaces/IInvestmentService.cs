using Backend.DTOs.Investment;
using Backend.Models;
using static Backend.AppCode.AppConstants;

namespace Backend.Services.Interfaces
{
    public interface IInvestmentService
    {
        Task<InvestmentDto?> GetByIdAsync(int id);
        Task<IEnumerable<InvestmentDto>> GetByUserIdAsync(string userId, int page, int pageSize);
        Task<IEnumerable<InvestmentDto>> GetByPortfolioIdAsync(int portfolioId, int page, int pageSize);
        Task<IEnumerable<InvestmentDto>> GetAllAsync(int page, int pageSize);
        Task<int> GetTotalCountAsync();
        Task<int> GetCountByUserIdAsync(string userId);
        Task<decimal> GetTotalValueAsync();
        Task<decimal> GetTotalValueByUserIdAsync(string userId);
        Task<InvestmentDto> CreateAsync(string userId, CreateInvestmentDto createDto);
        Task<bool> UpdateAsync(int id, string userId, UpdateInvestmentDto updateDto);
        Task<bool> DeleteAsync(int id, string userId);
        Task<IEnumerable<InvestmentDto>> SearchAsync(
            string? searchTerm,
            InvestmentType? type,
            InvestmentStatus? status,
            DateTime? startDate,
            DateTime? endDate);
    }
}
