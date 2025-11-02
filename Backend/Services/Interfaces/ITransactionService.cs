using Backend.DTOs.Transaction;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ITransactionService
    {
        Task<TransactionDto?> GetByIdAsync(int id);
        Task<IEnumerable<TransactionDto>> GetByInvestmentIdAsync(int investmentId);
        Task<IEnumerable<TransactionDto>> GetAllAsync(int page, int pageSize);
        Task<IEnumerable<TransactionDto>> GetRecentByUserIdAsync(string userId, int count);
        Task<int> GetTotalCountAsync();
        Task<int> GetTodayCountAsync();
        Task<TransactionDto> CreateAsync(string userId, CreateTransactionDto createDto);
        Task<(List<TransactionDto> transactions, int totalCount)> GetFilteredTransactionsAsync(
            string userId,
            TransactionFilterDto filterDto,
            bool isAdmin = false);
        Task<TransactionPreviewResultDto> PreviewTransactionAsync(
            string userId,
            TransactionPreviewDto previewDto);
        Task<List<InvestmentSummaryForDropdownDto>> GetUserInvestmentsForDropdownAsync(string userId);
        Task<int> GetCountByUserIdAsync(string userId);
    }
}
