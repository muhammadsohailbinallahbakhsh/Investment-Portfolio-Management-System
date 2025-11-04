using Backend.DTOs.Portfolio;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class PortfolioService : IPortfolioService
    {
        private readonly IPortfolioRepository _portfolioRepository;

        public PortfolioService(IPortfolioRepository portfolioRepository)
        {
            _portfolioRepository = portfolioRepository;
        }

        public async Task<PortfolioDto?> GetByIdAsync(int id)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);
            return portfolio != null ? MapToDto(portfolio) : null;
        }

        public async Task<IEnumerable<PortfolioDto>> GetByUserIdAsync(string userId)
        {
            var portfolios = await _portfolioRepository.GetByUserIdAsync(userId);
            return portfolios.Select(MapToDto);
        }

        public async Task<IEnumerable<PortfolioDto>> GetAllAsync(int page, int pageSize)
        {
            var portfolios = await _portfolioRepository.GetAllAsync(page, pageSize);
            return portfolios.Select(MapToDto);
        }

        public async Task<int> GetTotalCountAsync() => await _portfolioRepository.GetTotalCountAsync();
        public async Task<int> GetCountByUserIdAsync(string userId) => await _portfolioRepository.GetCountByUserIdAsync(userId);

        public async Task<PortfolioDto> CreateAsync(string userId, CreatePortfolioDto createDto)
        {
            var portfolio = new Portfolio
            {
                UserId = userId,
                Name = createDto.Name,
                Description = createDto.Description
            };

            var created = await _portfolioRepository.CreateAsync(portfolio);
            return MapToDto(created);
        }

        public async Task<bool> UpdateAsync(int id, string userId, UpdatePortfolioDto updateDto)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);
            if (portfolio == null || portfolio.UserId != userId)
                return false;

            portfolio.Name = updateDto.Name;
            portfolio.Description = updateDto.Description;
            return await _portfolioRepository.UpdateAsync(portfolio);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);
            if (portfolio == null || portfolio.UserId != userId)
                return false;

            // Prevent deletion of default portfolio
            if (portfolio.IsDefault)
                return false;

            return await _portfolioRepository.SoftDeleteAsync(id);
        }

        public async Task<PortfolioDetailDto?> GetDetailByIdAsync(int id, string userId)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);

            if (portfolio == null || portfolio.UserId != userId)
                return null;

            var investments = portfolio.Investments.Where(i => !i.IsDeleted).ToList();

            var totalInvested = investments.Sum(i => i.InitialAmount);
            var currentValue = investments.Sum(i => i.CurrentValue);
            var totalGainLoss = currentValue - totalInvested;
            var totalGainLossPercentage = totalInvested > 0
                ? Math.Round((totalGainLoss / totalInvested) * 100, 2)
                : 0;

            // Breakdown by type
            var valueByType = investments
                .GroupBy(i => i.Type.ToString())
                .ToDictionary(g => g.Key, g => g.Sum(i => i.CurrentValue));

            var countByType = investments
                .GroupBy(i => i.Type.ToString())
                .ToDictionary(g => g.Key, g => g.Count());

            // Breakdown by status
            var countByStatus = investments
                .GroupBy(i => i.Status.ToString())
                .ToDictionary(g => g.Key, g => g.Count());

            // Investment summaries
            var investmentSummaries = investments.Select(i =>
            {
                var gainLoss = i.CurrentValue - i.InitialAmount;
                var gainLossPercent = i.InitialAmount > 0
                    ? Math.Round((gainLoss / i.InitialAmount) * 100, 2)
                    : 0;

                return new PortfolioInvestmentSummary
                {
                    Id = i.Id,
                    Name = i.Name,
                    Type = i.Type.ToString(),
                    Status = i.Status.ToString(),
                    InitialAmount = i.InitialAmount,
                    CurrentValue = i.CurrentValue,
                    GainLoss = gainLoss,
                    GainLossPercentage = gainLossPercent,
                    PurchaseDate = i.PurchaseDate
                };
            }).OrderByDescending(i => i.CurrentValue).ToList();

            return new PortfolioDetailDto
            {
                Id = portfolio.Id,
                UserId = portfolio.UserId,
                UserName = portfolio.User != null
                    ? $"{portfolio.User.FirstName} {portfolio.User.LastName}"
                    : string.Empty,
                Name = portfolio.Name,
                Description = portfolio.Description,
                TotalInvested = totalInvested,
                CurrentValue = currentValue,
                TotalGainLoss = totalGainLoss,
                TotalGainLossPercentage = totalGainLossPercentage,
                TotalInvestments = investments.Count,
                ActiveInvestments = investments.Count(i => i.Status == Backend.AppCode.AppConstants.InvestmentStatus.Active),
                ValueByType = valueByType,
                CountByType = countByType,
                CountByStatus = countByStatus,
                Investments = investmentSummaries,
                CreatedAt = portfolio.CreatedAt,
                UpdatedAt = portfolio.UpdatedAt
            };
        }

        public async Task<PortfolioStatsDto?> GetPortfolioStatsAsync(int id, string userId)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);

            if (portfolio == null || portfolio.UserId != userId)
                return null;

            var investments = portfolio.Investments.Where(i => !i.IsDeleted).ToList();

            var totalInvested = investments.Sum(i => i.InitialAmount);
            var currentValue = investments.Sum(i => i.CurrentValue);
            var totalGainLoss = currentValue - totalInvested;
            var totalGainLossPercentage = totalInvested > 0
                ? Math.Round((totalGainLoss / totalInvested) * 100, 2)
                : 0;

            // Count by status
            var activeCount = investments.Count(i => i.Status == Backend.AppCode.AppConstants.InvestmentStatus.Active);
            var soldCount = investments.Count(i => i.Status == Backend.AppCode.AppConstants.InvestmentStatus.Sold);
            var onHoldCount = investments.Count(i => i.Status == Backend.AppCode.AppConstants.InvestmentStatus.OnHold);

            // Best and worst performing
            var investmentsWithPerformance = investments.Select(i =>
            {
                var gainLoss = i.CurrentValue - i.InitialAmount;
                var gainLossPercent = i.InitialAmount > 0
                    ? (gainLoss / i.InitialAmount) * 100
                    : 0;
                return new { Investment = i, GainLossPercent = gainLossPercent };
            }).ToList();

            var bestPerforming = investmentsWithPerformance
                .OrderByDescending(x => x.GainLossPercent)
                .FirstOrDefault();

            var worstPerforming = investmentsWithPerformance
                .OrderBy(x => x.GainLossPercent)
                .FirstOrDefault();

            // Asset allocation
            var assetAllocation = investments
                .GroupBy(i => i.Type.ToString())
                .Select(g =>
                {
                    var typeValue = g.Sum(i => i.CurrentValue);
                    var typePercentage = currentValue > 0
                        ? Math.Round((typeValue / currentValue) * 100, 2)
                        : 0;

                    return new AssetAllocation
                    {
                        Type = g.Key,
                        Value = typeValue,
                        Percentage = typePercentage,
                        Count = g.Count()
                    };
                })
                .OrderByDescending(a => a.Value)
                .ToList();

            return new PortfolioStatsDto
            {
                PortfolioId = portfolio.Id,
                PortfolioName = portfolio.Name,
                TotalInvested = totalInvested,
                CurrentValue = currentValue,
                TotalGainLoss = totalGainLoss,
                TotalGainLossPercentage = totalGainLossPercentage,
                TotalInvestments = investments.Count,
                ActiveInvestments = activeCount,
                SoldInvestments = soldCount,
                OnHoldInvestments = onHoldCount,
                BestPerforming = bestPerforming != null ? new InvestmentPerformance
                {
                    Id = bestPerforming.Investment.Id,
                    Name = bestPerforming.Investment.Name,
                    Type = bestPerforming.Investment.Type.ToString(),
                    CurrentValue = bestPerforming.Investment.CurrentValue,
                    GainLossPercentage = Math.Round(bestPerforming.GainLossPercent, 2)
                } : null,
                WorstPerforming = worstPerforming != null ? new InvestmentPerformance
                {
                    Id = worstPerforming.Investment.Id,
                    Name = worstPerforming.Investment.Name,
                    Type = worstPerforming.Investment.Type.ToString(),
                    CurrentValue = worstPerforming.Investment.CurrentValue,
                    GainLossPercentage = Math.Round(worstPerforming.GainLossPercent, 2)
                } : null,
                AssetAllocation = assetAllocation
            };
        }

        public async Task<List<PortfolioSummaryDto>> GetUserPortfolioSummariesAsync(string userId)
        {
            var portfolios = await _portfolioRepository.GetByUserIdAsync(userId);

            return portfolios.Select(p =>
            {
                var investments = p.Investments.Where(i => !i.IsDeleted).ToList();

                return new PortfolioSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    IsDefault = p.IsDefault,
                    InvestmentCount = investments.Count,
                    TotalValue = investments.Sum(i => i.CurrentValue),
                    CreatedAt = p.CreatedAt
                };
            }).OrderBy(p => p.Name).ToList();
        }

        public async Task<bool> CanDeleteAsync(int id, string userId)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);

            if (portfolio == null || portfolio.UserId != userId)
                return false;

            // Portfolio can only be deleted if it has no investments
            var hasInvestments = portfolio.Investments.Any(i => !i.IsDeleted);
            return !hasInvestments;
        }

        public async Task<bool> IsInUseAsync(int id)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);

            if (portfolio == null)
                return false;

            // Portfolio is in use if it has any non-deleted investments
            return portfolio.Investments.Any(i => !i.IsDeleted);
        }

        public async Task<int> GetInvestmentCountAsync(int id)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);

            if (portfolio == null)
                return 0;

            return portfolio.Investments.Count(i => !i.IsDeleted);
        }

        // ==========================================
        // HELPER METHOD
        // ==========================================

        public async Task<PortfolioDto> GetOrCreateDefaultPortfolioAsync(string userId)
        {
            var portfolios = await _portfolioRepository.GetByUserIdAsync(userId);
            var defaultPortfolio = portfolios.FirstOrDefault(p => p.IsDefault && !p.IsDeleted);

            if (defaultPortfolio != null)
            {
                return MapToDto(defaultPortfolio);
            }

            // Create default portfolio
            var portfolio = new Portfolio
            {
                UserId = userId,
                Name = "Default Portfolio",
                Description = "Your default investment portfolio",
                IsDefault = true
            };

            var created = await _portfolioRepository.CreateAsync(portfolio);
            return MapToDto(created);
        }

        private static PortfolioDto MapToDto(Portfolio p)
        {
            var investments = p.Investments.Where(i => !i.IsDeleted).ToList();

            return new PortfolioDto
            {
                Id = p.Id,
                UserId = p.UserId,
                Name = p.Name,
                Description = p.Description,
                IsDefault = p.IsDefault,
                TotalInvested = investments.Sum(i => i.InitialAmount),
                CurrentValue = investments.Sum(i => i.CurrentValue),
                TotalInvestments = investments.Count,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            };
        }
    }
}
