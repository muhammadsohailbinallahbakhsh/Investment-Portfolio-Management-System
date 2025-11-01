using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;

namespace Backend.Repositories.Implementations
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _context;

        public TransactionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Transaction?> GetByIdAsync(int id)
        {
            return await _context.Transactions
                .Include(t => t.Investment)
                .ThenInclude(i => i.Portfolio)
                .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);
        }

        public async Task<IEnumerable<Transaction>> GetByInvestmentIdAsync(int investmentId)
        {
            return await _context.Transactions
                .Where(t => t.InvestmentId == investmentId && !t.IsDeleted)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> GetAllAsync(int page, int pageSize)
        {
            return await _context.Transactions
                .Include(t => t.Investment)
                .OrderByDescending(t => t.TransactionDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> GetRecentByUserIdAsync(string userId, int count)
        {
            return await _context.Transactions
                .Include(t => t.Investment)
                .Where(t => t.Investment.UserId == userId && !t.IsDeleted)
                .OrderByDescending(t => t.TransactionDate)
                .Take(count)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync() =>
            await _context.Transactions.CountAsync(t => !t.IsDeleted);

        public async Task<int> GetTodayCountAsync()
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Transactions.CountAsync(t => !t.IsDeleted && t.TransactionDate.Date == today);
        }

        public async Task<Transaction> CreateAsync(Transaction transaction)
        {
            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }
    }
}
