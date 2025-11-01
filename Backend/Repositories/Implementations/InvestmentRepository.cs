using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Backend.AppCode.AppConstants;

namespace Backend.Repositories.Implementations
{
    public class InvestmentRepository : IInvestmentRepository
    {
        private readonly ApplicationDbContext _context;

        public InvestmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Investment?> GetByIdAsync(int id)
        {
            return await _context.Investments
                .Include(i => i.Transactions)
                .Include(i => i.Portfolio)
                .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);
        }

        public async Task<IEnumerable<Investment>> GetByUserIdAsync(string userId, int page, int pageSize)
        {
            return await _context.Investments
                .Where(i => i.UserId == userId && !i.IsDeleted)
                .Include(i => i.Portfolio)
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Investment>> GetByPortfolioIdAsync(int portfolioId, int page, int pageSize)
        {
            return await _context.Investments
                .Where(i => i.PortfolioId == portfolioId && !i.IsDeleted)
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Investment>> GetAllAsync(int page, int pageSize)
        {
            return await _context.Investments
                .Include(i => i.User)
                .Include(i => i.Portfolio)
                .Where(i => !i.IsDeleted)
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync() =>
            await _context.Investments.CountAsync(i => !i.IsDeleted);

        public async Task<int> GetCountByUserIdAsync(string userId) =>
            await _context.Investments.CountAsync(i => i.UserId == userId && !i.IsDeleted && i.Status == InvestmentStatus.Active);

        public async Task<decimal> GetTotalValueAsync() =>
            await _context.Investments.Where(i => !i.IsDeleted).SumAsync(i => i.CurrentValue);

        public async Task<decimal> GetTotalValueByUserIdAsync(string userId) =>
            await _context.Investments.Where(i => i.UserId == userId && !i.IsDeleted && i.Status == InvestmentStatus.Active)
                                      .SumAsync(i => i.CurrentValue);

        public async Task<Investment> CreateAsync(Investment investment)
        {
            await _context.Investments.AddAsync(investment);
            await _context.SaveChangesAsync();
            return investment;
        }

        public async Task<bool> UpdateAsync(Investment investment)
        {
            investment.UpdatedAt = DateTime.UtcNow;
            _context.Investments.Update(investment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SoftDeleteAsync(int id)
        {
            var investment = await _context.Investments.FindAsync(id);
            if (investment == null) return false;

            investment.IsDeleted = true;
            investment.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Investment>> SearchAsync(
            string? searchTerm,
            InvestmentType? type,
            InvestmentStatus? status,
            DateTime? startDate,
            DateTime? endDate)
        {
            var query = _context.Investments.AsQueryable().Where(i => !i.IsDeleted);

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(i => i.Name.Contains(searchTerm));

            if (type.HasValue)
                query = query.Where(i => i.Type == type);

            if (status.HasValue)
                query = query.Where(i => i.Status == status);

            if (startDate.HasValue)
                query = query.Where(i => i.PurchaseDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(i => i.PurchaseDate <= endDate.Value);

            return await query.OrderByDescending(i => i.CreatedAt).ToListAsync();
        }
    }
}
