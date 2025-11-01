using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByIdAsync(int id);
        Task<IEnumerable<Transaction>> GetByInvestmentIdAsync(int investmentId);
        Task<IEnumerable<Transaction>> GetAllAsync(int page, int pageSize);
        Task<IEnumerable<Transaction>> GetRecentByUserIdAsync(string userId, int count);

        Task<int> GetTotalCountAsync();
        Task<int> GetTodayCountAsync();

        Task<Transaction> CreateAsync(Transaction transaction);
    }
}
