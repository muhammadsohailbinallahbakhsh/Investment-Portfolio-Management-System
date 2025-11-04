using Backend.DTOs.Investment;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using System.Text;
using static Backend.AppCode.AppConstants;

namespace Backend.Services.Implementations
{
    public class InvestmentService : IInvestmentService
    {
        private readonly IInvestmentRepository _investmentRepository;
        private readonly IPortfolioService _portfolioService;

        public InvestmentService(
            IInvestmentRepository investmentRepository,
            IPortfolioService portfolioService)
        {
            _investmentRepository = investmentRepository;
            _portfolioService = portfolioService;
        }

        public async Task<InvestmentDto?> GetByIdAsync(int id)
        {
            var investment = await _investmentRepository.GetByIdAsync(id);
            return investment != null ? MapToDto(investment) : null;
        }

        public async Task<IEnumerable<InvestmentDto>> GetByUserIdAsync(string userId, int page, int pageSize)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, page, pageSize);
            return investments.Select(MapToDto);
        }

        public async Task<IEnumerable<InvestmentDto>> GetByPortfolioIdAsync(int portfolioId, int page, int pageSize)
        {
            var investments = await _investmentRepository.GetByPortfolioIdAsync(portfolioId, page, pageSize);
            return investments.Select(MapToDto);
        }

        public async Task<IEnumerable<InvestmentDto>> GetAllAsync(int page, int pageSize)
        {
            var investments = await _investmentRepository.GetAllAsync(page, pageSize);
            return investments.Select(MapToDto);
        }

        public async Task<int> GetTotalCountAsync() => await _investmentRepository.GetTotalCountAsync();

        public async Task<int> GetCountByUserIdAsync(string userId) => await _investmentRepository.GetCountByUserIdAsync(userId);

        public async Task<decimal> GetTotalValueAsync() => await _investmentRepository.GetTotalValueAsync();

        public async Task<decimal> GetTotalValueByUserIdAsync(string userId) => await _investmentRepository.GetTotalValueByUserIdAsync(userId);

        public async Task<InvestmentDto> CreateAsync(string userId, CreateInvestmentDto createDto)
        {
            // Ensure portfolio exists, if not use or create default
            int portfolioId = createDto.PortfolioId;
            var portfolio = await _portfolioService.GetByIdAsync(portfolioId);
            
            if (portfolio == null || portfolio.UserId != userId)
            {
                // Get or create default portfolio
                var defaultPortfolio = await _portfolioService.GetOrCreateDefaultPortfolioAsync(userId);
                portfolioId = defaultPortfolio.Id;
            }

            var investment = new Investment
            {
                UserId = userId,
                PortfolioId = portfolioId,
                Name = createDto.Name,
                Type = Enum.Parse<InvestmentType>(createDto.Type, true),
                InitialAmount = createDto.InitialAmount,
                CurrentValue = createDto.InitialAmount,
                Quantity = createDto.Quantity,
                AveragePricePerUnit = createDto.AveragePricePerUnit,
                PurchaseDate = createDto.PurchaseDate,
                BrokerPlatform = createDto.BrokerPlatform,
                Notes = createDto.Notes,
                Status = Enum.Parse<InvestmentStatus>(createDto.Status, true)
            };

            var created = await _investmentRepository.CreateAsync(investment);
            return MapToDto(created);
        }

        public async Task<bool> UpdateAsync(int id, string userId, UpdateInvestmentDto updateDto)
        {
            var investment = await _investmentRepository.GetByIdAsync(id);
            if (investment == null || investment.UserId != userId) return false;

            investment.Name = updateDto.Name;
            investment.Type = Enum.Parse<InvestmentType>(updateDto.Type, true);
            investment.InitialAmount = updateDto.InitialAmount;
            investment.Quantity = updateDto.Quantity;
            investment.AveragePricePerUnit = updateDto.AveragePricePerUnit;
            investment.PurchaseDate = updateDto.PurchaseDate;
            investment.BrokerPlatform = updateDto.BrokerPlatform;
            investment.Notes = updateDto.Notes;
            investment.Status = Enum.Parse<InvestmentStatus>(updateDto.Status, true);

            return await _investmentRepository.UpdateAsync(investment);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var investment = await _investmentRepository.GetByIdAsync(id);
            if (investment == null || investment.UserId != userId) return false;
            return await _investmentRepository.SoftDeleteAsync(id);
        }

        public async Task<IEnumerable<InvestmentDto>> SearchAsync(string? searchTerm, InvestmentType? type, InvestmentStatus? status, DateTime? startDate, DateTime? endDate)
        {
            var investments = await _investmentRepository.SearchAsync(searchTerm, type, status, startDate, endDate);
            return investments.Select(MapToDto);
        }

        private static InvestmentDto MapToDto(Investment investment)
        {
            var gainLoss = investment.CurrentValue - investment.InitialAmount;
            var gainLossPercentage = investment.InitialAmount > 0 ? (gainLoss / investment.InitialAmount) * 100 : 0;

            return new InvestmentDto
            {
                Id = investment.Id,
                UserId = investment.UserId,
                PortfolioId = investment.PortfolioId,
                PortfolioName = investment.Portfolio?.Name,
                Name = investment.Name,
                Type = investment.Type.ToString(),
                InitialAmount = investment.InitialAmount,
                CurrentValue = investment.CurrentValue,
                Quantity = investment.Quantity,
                AveragePricePerUnit = investment.AveragePricePerUnit,
                PurchaseDate = investment.PurchaseDate,
                BrokerPlatform = investment.BrokerPlatform,
                Notes = investment.Notes,
                Status = investment.Status.ToString(),
                CreatedAt = investment.CreatedAt,
                UpdatedAt = investment.UpdatedAt
            };
        }

        public async Task<InvestmentDetailDto?> GetDetailByIdAsync(int id, string userId)
        {
            var investment = await _investmentRepository.GetByIdAsync(id);

            if (investment == null || investment.UserId != userId)
                return null;

            // Build performance history from transactions
            var performanceHistory = investment.Transactions
                .OrderBy(t => t.TransactionDate)
                .Select(t => new PerformancePoint
                {
                    Date = t.TransactionDate,
                    Value = t.Amount
                })
                .ToList();

            // Add initial investment as first point
            performanceHistory.Insert(0, new PerformancePoint
            {
                Date = investment.PurchaseDate,
                Value = investment.InitialAmount
            });

            return new InvestmentDetailDto
            {
                Id = investment.Id,
                UserId = investment.UserId,
                PortfolioId = investment.PortfolioId,
                PortfolioName = investment.Portfolio?.Name,
                Name = investment.Name,
                Type = investment.Type.ToString(),
                InitialAmount = investment.InitialAmount,
                CurrentValue = investment.CurrentValue,
                Quantity = investment.Quantity,
                AveragePricePerUnit = investment.AveragePricePerUnit,
                PurchaseDate = investment.PurchaseDate,
                BrokerPlatform = investment.BrokerPlatform,
                Notes = investment.Notes,
                Status = investment.Status.ToString(),
                CreatedAt = investment.CreatedAt,
                UpdatedAt = investment.UpdatedAt,
                PerformanceHistory = performanceHistory,
                Transactions = investment.Transactions.Select(t => new TransactionSummaryDto
                {
                    Id = t.Id,
                    Type = t.Type.ToString(),
                    Quantity = t.Quantity,
                    PricePerUnit = t.PricePerUnit,
                    Amount = t.Amount,
                    TransactionDate = t.TransactionDate,
                    Notes = t.Notes
                }).OrderByDescending(t => t.TransactionDate).ToList()
            };
        }

        public async Task<(List<InvestmentDto> investments, int totalCount)> GetFilteredInvestmentsAsync(
            string userId, InvestmentFilterDto filterDto, bool isAdmin = false)
        {
            // Get base query
            var investments = isAdmin
                ? await _investmentRepository.GetAllAsync(1, int.MaxValue)
                : await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);

            var query = investments.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(filterDto.SearchTerm))
            {
                query = query.Where(i => i.Name.Contains(filterDto.SearchTerm, StringComparison.OrdinalIgnoreCase));
            }

            // Apply type filter
            if (!string.IsNullOrWhiteSpace(filterDto.Type))
            {
                query = query.Where(i => i.Type.ToString().Equals(filterDto.Type, StringComparison.OrdinalIgnoreCase));
            }

            // Apply status filter
            if (!string.IsNullOrWhiteSpace(filterDto.Status))
            {
                query = query.Where(i => i.Status.ToString().Equals(filterDto.Status, StringComparison.OrdinalIgnoreCase));
            }

            // Apply date range filter
            if (filterDto.StartDate.HasValue)
            {
                query = query.Where(i => i.PurchaseDate >= filterDto.StartDate.Value);
            }
            if (filterDto.EndDate.HasValue)
            {
                query = query.Where(i => i.PurchaseDate <= filterDto.EndDate.Value);
            }

            // Convert to DTOs for gain/loss calculation
            var investmentDtos = query.Select(MapToDto).ToList();

            // Apply gain/loss filter
            if (filterDto.MinGainLoss.HasValue)
            {
                investmentDtos = investmentDtos.Where(i => i.GainLoss >= filterDto.MinGainLoss.Value).ToList();
            }
            if (filterDto.MaxGainLoss.HasValue)
            {
                investmentDtos = investmentDtos.Where(i => i.GainLoss <= filterDto.MaxGainLoss.Value).ToList();
            }

            // Apply sorting
            investmentDtos = ApplySorting(investmentDtos, filterDto.SortBy, filterDto.SortOrder);

            var totalCount = investmentDtos.Count;

            // Apply pagination
            var paginatedList = investmentDtos
                .Skip((filterDto.Page - 1) * filterDto.PageSize)
                .Take(filterDto.PageSize)
                .ToList();

            return (paginatedList, totalCount);
        }

        private List<InvestmentDto> ApplySorting(List<InvestmentDto> investments, string? sortBy, string? sortOrder)
        {
            var isDescending = sortOrder?.ToLower() == "desc";

            return sortBy?.ToLower() switch
            {
                "amount" => isDescending
                    ? investments.OrderByDescending(i => i.InitialAmount).ToList()
                    : investments.OrderBy(i => i.InitialAmount).ToList(),

                "currentvalue" => isDescending
                    ? investments.OrderByDescending(i => i.CurrentValue).ToList()
                    : investments.OrderBy(i => i.CurrentValue).ToList(),

                "gainloss" => isDescending
                    ? investments.OrderByDescending(i => i.GainLoss).ToList()
                    : investments.OrderBy(i => i.GainLoss).ToList(),

                "purchasedate" => isDescending
                    ? investments.OrderByDescending(i => i.PurchaseDate).ToList()
                    : investments.OrderBy(i => i.PurchaseDate).ToList(),

                _ => investments.OrderByDescending(i => i.CreatedAt).ToList()
            };
        }

        public async Task<bool> BulkDeleteAsync(List<int> investmentIds, string userId, bool isAdmin = false)
        {
            var successCount = 0;

            foreach (var id in investmentIds)
            {
                var investment = await _investmentRepository.GetByIdAsync(id);

                // Check ownership unless admin
                if (investment != null && (isAdmin || investment.UserId == userId))
                {
                    if (await _investmentRepository.SoftDeleteAsync(id))
                        successCount++;
                }
            }

            return successCount > 0;
        }

        public async Task<InvestmentStatsDto> GetUserStatsAsync(string userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var totalInvested = investmentList.Sum(i => i.InitialAmount);
            var currentValue = investmentList.Sum(i => i.CurrentValue);
            var totalGainLoss = currentValue - totalInvested;
            var totalGainLossPercentage = totalInvested > 0
                ? Math.Round((totalGainLoss / totalInvested) * 100, 2)
                : 0;

            // Find best and worst performing
            var investmentDtos = investmentList.Select(MapToDto).ToList();
            var bestPerforming = investmentDtos
                .OrderByDescending(i => i.GainLossPercentage)
                .FirstOrDefault();
            var worstPerforming = investmentDtos
                .OrderBy(i => i.GainLossPercentage)
                .FirstOrDefault();

            // Group by type
            var investmentsByType = investmentList
                .GroupBy(i => i.Type.ToString())
                .ToDictionary(g => g.Key, g => g.Count());

            var valueByType = investmentList
                .GroupBy(i => i.Type.ToString())
                .ToDictionary(g => g.Key, g => g.Sum(i => i.CurrentValue));

            return new InvestmentStatsDto
            {
                TotalInvestments = investmentList.Count,
                TotalInvested = totalInvested,
                CurrentValue = currentValue,
                TotalGainLoss = totalGainLoss,
                TotalGainLossPercentage = totalGainLossPercentage,
                BestPerforming = bestPerforming != null ? new InvestmentSummary
                {
                    Id = bestPerforming.Id,
                    Name = bestPerforming.Name,
                    Type = bestPerforming.Type,
                    GainLossPercentage = bestPerforming.GainLossPercentage,
                    CurrentValue = bestPerforming.CurrentValue
                } : null,
                WorstPerforming = worstPerforming != null ? new InvestmentSummary
                {
                    Id = worstPerforming.Id,
                    Name = worstPerforming.Name,
                    Type = worstPerforming.Type,
                    GainLossPercentage = worstPerforming.GainLossPercentage,
                    CurrentValue = worstPerforming.CurrentValue
                } : null,
                InvestmentsByType = investmentsByType,
                ValueByType = valueByType
            };
        }

        public async Task<byte[]> ExportInvestmentToCsvAsync(int id, string userId)
        {
            var investment = await _investmentRepository.GetByIdAsync(id);

            if (investment == null || investment.UserId != userId)
                throw new UnauthorizedAccessException("Investment not found or access denied");

            var csv = new StringBuilder();
            csv.AppendLine("Investment Report");
            csv.AppendLine($"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
            csv.AppendLine();
            csv.AppendLine("Investment Details");
            csv.AppendLine("Name,Type,Status,Initial Amount,Current Value,Gain/Loss,Gain/Loss %,Purchase Date,Broker");

            var gainLoss = investment.CurrentValue - investment.InitialAmount;
            var gainLossPercent = investment.InitialAmount > 0
                ? Math.Round((gainLoss / investment.InitialAmount) * 100, 2)
                : 0;

            csv.AppendLine($"\"{investment.Name}\",{investment.Type},{investment.Status}," +
                          $"{investment.InitialAmount},{investment.CurrentValue}," +
                          $"{gainLoss},{gainLossPercent}%," +
                          $"{investment.PurchaseDate:yyyy-MM-dd},\"{investment.BrokerPlatform}\"");

            csv.AppendLine();
            csv.AppendLine("Transaction History");
            csv.AppendLine("Date,Type,Quantity,Price Per Unit,Amount,Notes");

            foreach (var transaction in investment.Transactions.OrderBy(t => t.TransactionDate))
            {
                csv.AppendLine($"{transaction.TransactionDate:yyyy-MM-dd},{transaction.Type}," +
                              $"{transaction.Quantity},{transaction.PricePerUnit}," +
                              $"{transaction.Amount},\"{transaction.Notes}\"");
            }

            return Encoding.UTF8.GetBytes(csv.ToString());
        }

        public async Task<byte[]> ExportAllToCsvAsync(List<int> investmentIds, string userId)
        {
            var csv = new StringBuilder();
            csv.AppendLine("Investments Export");
            csv.AppendLine($"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
            csv.AppendLine();
            csv.AppendLine("Name,Type,Status,Initial Amount,Current Value,Gain/Loss,Gain/Loss %,Purchase Date,Broker,Portfolio");

            foreach (var id in investmentIds)
            {
                var investment = await _investmentRepository.GetByIdAsync(id);

                if (investment == null || investment.UserId != userId)
                    continue;

                var gainLoss = investment.CurrentValue - investment.InitialAmount;
                var gainLossPercent = investment.InitialAmount > 0
                    ? Math.Round((gainLoss / investment.InitialAmount) * 100, 2)
                    : 0;

                csv.AppendLine($"\"{investment.Name}\",{investment.Type},{investment.Status}," +
                              $"{investment.InitialAmount},{investment.CurrentValue}," +
                              $"{gainLoss},{gainLossPercent}%," +
                              $"{investment.PurchaseDate:yyyy-MM-dd}," +
                              $"\"{investment.BrokerPlatform}\",\"{investment.Portfolio?.Name}\"");
            }

            return Encoding.UTF8.GetBytes(csv.ToString());
        }
    }
}
