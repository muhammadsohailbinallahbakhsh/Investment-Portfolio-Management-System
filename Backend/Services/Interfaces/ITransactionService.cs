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

        /// <summary>
        /// Get filtered transactions with pagination and sorting
        /// </summary>
        Task<(List<TransactionDto> transactions, int totalCount)> GetFilteredTransactionsAsync(
            string userId,
            TransactionFilterDto filterDto,
            bool isAdmin = false);

        /// <summary>
        /// Preview transaction impact before creating it
        /// Shows new total value, validation errors
        /// </summary>
        Task<TransactionPreviewResultDto> PreviewTransactionAsync(
            string userId,
            TransactionPreviewDto previewDto);

        /// <summary>
        /// Get user's investments for dropdown selection (only active investments)
        /// </summary>
        Task<List<InvestmentSummaryForDropdownDto>> GetUserInvestmentsForDropdownAsync(string userId);

        /// <summary>
        /// Get transaction count by user
        /// </summary>
        Task<int> GetCountByUserIdAsync(string userId);
    }
}
