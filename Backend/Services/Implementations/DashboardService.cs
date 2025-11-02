using Backend.DTOs.Dashboard;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using static Backend.AppCode.AppConstants;

namespace Backend.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly IInvestmentRepository _investmentRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IPortfolioRepository _portfolioRepository;
        private readonly ILogger<DashboardService> _logger;

        // Color palette for asset allocation chart
        private readonly Dictionary<string, string> _typeColors = new()
        {
            { "Stocks", "#3b82f6" },      // Blue
            { "Bonds", "#10b981" },       // Green
            { "RealEstate", "#f59e0b" },  // Amber
            { "Crypto", "#8b5cf6" },      // Purple
            { "MutualFunds", "#ec4899" }, // Pink
            { "Other", "#6b7280" }        // Gray
        };

        public DashboardService(
            IInvestmentRepository investmentRepository,
            ITransactionRepository transactionRepository,
            IPortfolioRepository portfolioRepository,
            ILogger<DashboardService> logger)
        {
            _investmentRepository = investmentRepository;
            _transactionRepository = transactionRepository;
            _portfolioRepository = portfolioRepository;
            _logger = logger;
        }

        // ==========================================
        // Main Dashboard Data
        // ==========================================

        public async Task<UserDashboardDto> GetUserDashboardAsync(string userId)
        {
            var summaryCards = await GetSummaryCardsAsync(userId);
            var recentTransactions = await GetRecentTransactionsAsync(userId, 10);
            var performanceChart = await GetPerformanceChartDataAsync(userId, 12);
            var assetAllocation = await GetAssetAllocationAsync(userId);

            return new UserDashboardDto
            {
                SummaryCards = summaryCards,
                RecentTransactions = recentTransactions,
                PerformanceChart = performanceChart,
                AssetAllocation = assetAllocation,
                GeneratedAt = DateTime.UtcNow
            };
        }

        public async Task<PortfolioSummaryCards> GetSummaryCardsAsync(string userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var totalInvested = investmentList.Sum(i => i.InitialAmount);
            var currentValue = investmentList.Sum(i => i.CurrentValue);
            var totalGainLoss = currentValue - totalInvested;
            var totalGainLossPercentage = totalInvested > 0
                ? Math.Round((totalGainLoss / totalInvested) * 100, 2)
                : 0;

            var activeInvestments = investmentList.Count(i => i.Status == InvestmentStatus.Active);

            // Get best and worst performing
            var investmentsWithPerformance = investmentList
                .Where(i => i.InitialAmount > 0) // Exclude zero initial amount
                .Select(i => new
                {
                    Investment = i,
                    GainLoss = i.CurrentValue - i.InitialAmount,
                    GainLossPercentage = (i.CurrentValue - i.InitialAmount) / i.InitialAmount * 100
                })
                .ToList();

            var bestPerforming = investmentsWithPerformance
                .OrderByDescending(x => x.GainLossPercentage)
                .FirstOrDefault();

            var worstPerforming = investmentsWithPerformance
                .OrderBy(x => x.GainLossPercentage)
                .FirstOrDefault();

            // Get transaction data
            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var lastTransaction = transactions.OrderByDescending(t => t.TransactionDate).FirstOrDefault();

            // Get portfolio count
            var portfolioCount = await _portfolioRepository.GetCountByUserIdAsync(userId);

            return new PortfolioSummaryCards
            {
                TotalInvestmentValue = currentValue,
                TotalInvested = totalInvested,
                TotalGainLoss = totalGainLoss,
                TotalGainLossPercentage = totalGainLossPercentage,
                NumberOfActiveInvestments = activeInvestments,
                TotalInvestments = investmentList.Count,
                BestPerforming = bestPerforming != null ? new InvestmentPerformanceCard
                {
                    Id = bestPerforming.Investment.Id,
                    Name = bestPerforming.Investment.Name,
                    Type = bestPerforming.Investment.Type.ToString(),
                    CurrentValue = bestPerforming.Investment.CurrentValue,
                    InitialAmount = bestPerforming.Investment.InitialAmount,
                    GainLoss = bestPerforming.GainLoss,
                    GainLossPercentage = Math.Round(bestPerforming.GainLossPercentage, 2),
                    Status = bestPerforming.Investment.Status.ToString(),
                    PurchaseDate = bestPerforming.Investment.PurchaseDate
                } : null,
                WorstPerforming = worstPerforming != null ? new InvestmentPerformanceCard
                {
                    Id = worstPerforming.Investment.Id,
                    Name = worstPerforming.Investment.Name,
                    Type = worstPerforming.Investment.Type.ToString(),
                    CurrentValue = worstPerforming.Investment.CurrentValue,
                    InitialAmount = worstPerforming.Investment.InitialAmount,
                    GainLoss = worstPerforming.GainLoss,
                    GainLossPercentage = Math.Round(worstPerforming.GainLossPercentage, 2),
                    Status = worstPerforming.Investment.Status.ToString(),
                    PurchaseDate = worstPerforming.Investment.PurchaseDate
                } : null,
                TotalTransactions = transactions.Count(),
                LastTransactionDate = lastTransaction?.TransactionDate,
                PortfolioCount = portfolioCount
            };
        }

        // ==========================================
        // Recent Transactions
        // ==========================================

        public async Task<List<RecentTransactionDto>> GetRecentTransactionsAsync(
            string userId, int count = 10)
        {
            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, count);

            return transactions.Select(t => new RecentTransactionDto
            {
                Id = t.Id,
                InvestmentId = t.InvestmentId,
                InvestmentName = t.Investment?.Name ?? string.Empty,
                InvestmentType = t.Investment?.Type.ToString() ?? string.Empty,
                Type = t.Type.ToString(),
                Amount = t.Amount,
                Quantity = t.Quantity,
                PricePerUnit = t.PricePerUnit,
                TransactionDate = t.TransactionDate,
                Notes = t.Notes,
                TimeAgo = GetTimeAgo(t.TransactionDate)
            }).ToList();
        }

        // ==========================================
        // Performance Chart
        // ==========================================

        public async Task<PerformanceChartData> GetPerformanceChartDataAsync(
            string userId, int months = 12)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var transactionList = transactions.ToList();

            var endDate = DateTime.UtcNow;
            var startDate = endDate.AddMonths(-months);

            var labels = new List<string>();
            var values = new List<decimal>();
            var investedValues = new List<decimal>();

            // Generate monthly data points
            for (int i = months - 1; i >= 0; i--)
            {
                var monthDate = endDate.AddMonths(-i);
                var monthStart = new DateTime(monthDate.Year, monthDate.Month, 1);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);

                labels.Add(monthStart.ToString("MMM yyyy")); // "Jan 2024"

                // Calculate value at end of this month
                var valueAtMonth = CalculatePortfolioValueAtDate(
                    investmentList, transactionList, monthEnd);

                var investedAtMonth = CalculateInvestedAmountAtDate(
                    investmentList, transactionList, monthEnd);

                values.Add(valueAtMonth);
                investedValues.Add(investedAtMonth);
            }

            var currentValue = values.LastOrDefault();
            var startValue = values.FirstOrDefault();
            var totalGrowth = currentValue - startValue;
            var totalGrowthPercentage = startValue > 0
                ? Math.Round((totalGrowth / startValue) * 100, 2)
                : 0;

            return new PerformanceChartData
            {
                Labels = labels,
                Values = values,
                InvestedValues = investedValues,
                CurrentValue = currentValue,
                StartValue = startValue,
                TotalGrowth = totalGrowth,
                TotalGrowthPercentage = totalGrowthPercentage,
                MonthsCovered = months,
                PeriodStart = startDate.ToString("MMM yyyy"),
                PeriodEnd = endDate.ToString("MMM yyyy")
            };
        }

        public async Task<List<MonthlyPerformanceSummary>> GetMonthlyPerformanceSummariesAsync(
            string userId, int months = 12)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var transactionList = transactions.ToList();

            var endDate = DateTime.UtcNow;
            var summaries = new List<MonthlyPerformanceSummary>();

            for (int i = months - 1; i >= 0; i--)
            {
                var monthDate = endDate.AddMonths(-i);
                var monthStart = new DateTime(monthDate.Year, monthDate.Month, 1);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);

                var startValue = CalculatePortfolioValueAtDate(
                    investmentList, transactionList, monthStart.AddDays(-1));
                var endValue = CalculatePortfolioValueAtDate(
                    investmentList, transactionList, monthEnd);

                var gainLoss = endValue - startValue;
                var gainLossPercentage = startValue > 0
                    ? Math.Round((gainLoss / startValue) * 100, 2)
                    : 0;

                var transactionCount = transactionList.Count(t =>
                    t.TransactionDate >= monthStart && t.TransactionDate <= monthEnd);

                summaries.Add(new MonthlyPerformanceSummary
                {
                    Month = monthStart.ToString("MMM yyyy"),
                    StartValue = startValue,
                    EndValue = endValue,
                    GainLoss = gainLoss,
                    GainLossPercentage = gainLossPercentage,
                    TransactionCount = transactionCount
                });
            }

            return summaries;
        }

        // ==========================================
        // Asset Allocation
        // ==========================================

        public async Task<AssetAllocationData> GetAssetAllocationAsync(string userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.Where(i => i.Status == InvestmentStatus.Active).ToList();

            var totalValue = investmentList.Sum(i => i.CurrentValue);

            var allocationByType = investmentList
                .GroupBy(i => i.Type.ToString())
                .Select(g =>
                {
                    var typeValue = g.Sum(i => i.CurrentValue);
                    var percentage = totalValue > 0
                        ? Math.Round((typeValue / totalValue) * 100, 2)
                        : 0;

                    return new AssetAllocationItem
                    {
                        Type = g.Key,
                        Value = typeValue,
                        Percentage = percentage,
                        Count = g.Count(),
                        Color = _typeColors.ContainsKey(g.Key) ? _typeColors[g.Key] : _typeColors["Other"]
                    };
                })
                .OrderByDescending(a => a.Value)
                .ToList();

            return new AssetAllocationData
            {
                Allocations = allocationByType,
                TotalValue = totalValue,
                TotalInvestments = investmentList.Count
            };
        }

        // ==========================================
        // Additional Dashboard Data
        // ==========================================

        public async Task<DashboardQuickStats> GetQuickStatsAsync(string userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var transactionList = transactions.ToList();

            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);

            // Today's gain/loss (simplified - compare to yesterday)
            var yesterday = today.AddDays(-1);
            var valueToday = CalculatePortfolioValueAtDate(investmentList, transactionList, today);
            var valueYesterday = CalculatePortfolioValueAtDate(investmentList, transactionList, yesterday);
            var todayGainLoss = valueToday - valueYesterday;
            var todayGainLossPercentage = valueYesterday > 0
                ? Math.Round((todayGainLoss / valueYesterday) * 100, 2)
                : 0;

            // This month's transactions
            var transactionsThisMonth = transactionList.Count(t => t.TransactionDate >= startOfMonth);

            // Investment growth this month
            var valueStartOfMonth = CalculatePortfolioValueAtDate(
                investmentList, transactionList, startOfMonth.AddDays(-1));
            var investmentGrowthThisMonth = valueToday - valueStartOfMonth;
            var investmentGrowthThisMonthPercentage = valueStartOfMonth > 0
                ? Math.Round((investmentGrowthThisMonth / valueStartOfMonth) * 100, 2)
                : 0;

            return new DashboardQuickStats
            {
                TodayGainLoss = todayGainLoss,
                TodayGainLossPercentage = todayGainLossPercentage,
                TransactionsThisMonth = transactionsThisMonth,
                InvestmentGrowthThisMonth = investmentGrowthThisMonth,
                InvestmentGrowthThisMonthPercentage = investmentGrowthThisMonthPercentage
            };
        }

        public async Task<PortfolioBreakdown> GetPortfolioBreakdownAsync(string userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            return new PortfolioBreakdown
            {
                ActiveInvestments = investmentList.Count(i => i.Status == InvestmentStatus.Active),
                SoldInvestments = investmentList.Count(i => i.Status == InvestmentStatus.Sold),
                OnHoldInvestments = investmentList.Count(i => i.Status == InvestmentStatus.OnHold),
                ActiveValue = investmentList.Where(i => i.Status == InvestmentStatus.Active).Sum(i => i.CurrentValue),
                SoldValue = investmentList.Where(i => i.Status == InvestmentStatus.Sold).Sum(i => i.CurrentValue),
                OnHoldValue = investmentList.Where(i => i.Status == InvestmentStatus.OnHold).Sum(i => i.CurrentValue)
            };
        }

        public async Task<List<InvestmentPerformanceCard>> GetTopPerformingInvestmentsAsync(
            string userId, int count = 5)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);

            return investments
                .Where(i => i.InitialAmount > 0)
                .Select(i => new InvestmentPerformanceCard
                {
                    Id = i.Id,
                    Name = i.Name,
                    Type = i.Type.ToString(),
                    CurrentValue = i.CurrentValue,
                    InitialAmount = i.InitialAmount,
                    GainLoss = i.CurrentValue - i.InitialAmount,
                    GainLossPercentage = Math.Round(((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100, 2),
                    Status = i.Status.ToString(),
                    PurchaseDate = i.PurchaseDate
                })
                .OrderByDescending(i => i.GainLossPercentage)
                .Take(count)
                .ToList();
        }

        public async Task<List<InvestmentPerformanceCard>> GetWorstPerformingInvestmentsAsync(
            string userId, int count = 5)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);

            return investments
                .Where(i => i.InitialAmount > 0)
                .Select(i => new InvestmentPerformanceCard
                {
                    Id = i.Id,
                    Name = i.Name,
                    Type = i.Type.ToString(),
                    CurrentValue = i.CurrentValue,
                    InitialAmount = i.InitialAmount,
                    GainLoss = i.CurrentValue - i.InitialAmount,
                    GainLossPercentage = Math.Round(((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100, 2),
                    Status = i.Status.ToString(),
                    PurchaseDate = i.PurchaseDate
                })
                .OrderBy(i => i.GainLossPercentage)
                .Take(count)
                .ToList();
        }

        // ==========================================
        // Helper Methods
        // ==========================================

        private decimal CalculatePortfolioValueAtDate(
            List<Backend.Models.Investment> investments,
            List<Backend.Models.Transaction> transactions,
            DateTime date)
        {
            decimal totalValue = 0;

            foreach (var investment in investments.Where(i => i.PurchaseDate <= date))
            {
                // Get transactions up to this date
                var investmentTransactions = transactions
                    .Where(t => t.InvestmentId == investment.Id && t.TransactionDate <= date)
                    .OrderBy(t => t.TransactionDate)
                    .ToList();

                if (!investmentTransactions.Any())
                {
                    // No transactions, use initial amount
                    totalValue += investment.InitialAmount;
                }
                else
                {
                    // Calculate value based on transactions
                    decimal currentValue = investment.InitialAmount;

                    foreach (var transaction in investmentTransactions)
                    {
                        switch (transaction.Type)
                        {
                            case TransactionType.Buy:
                                currentValue += transaction.Amount;
                                break;
                            case TransactionType.Sell:
                                currentValue -= transaction.Amount;
                                break;
                            case TransactionType.Update:
                                currentValue = transaction.Amount;
                                break;
                        }
                    }

                    totalValue += currentValue;
                }
            }

            return totalValue;
        }

        private decimal CalculateInvestedAmountAtDate(
            List<Backend.Models.Investment> investments,
            List<Backend.Models.Transaction> transactions,
            DateTime date)
        {
            return investments
                .Where(i => i.PurchaseDate <= date)
                .Sum(i => i.InitialAmount);
        }

        private string GetTimeAgo(DateTime date)
        {
            var timeSpan = DateTime.UtcNow - date;

            if (timeSpan.TotalMinutes < 1)
                return "just now";
            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes} minute{((int)timeSpan.TotalMinutes != 1 ? "s" : "")} ago";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours} hour{((int)timeSpan.TotalHours != 1 ? "s" : "")} ago";
            if (timeSpan.TotalDays < 30)
                return $"{(int)timeSpan.TotalDays} day{((int)timeSpan.TotalDays != 1 ? "s" : "")} ago";
            if (timeSpan.TotalDays < 365)
                return $"{(int)(timeSpan.TotalDays / 30)} month{((int)(timeSpan.TotalDays / 30) != 1 ? "s" : "")} ago";

            return $"{(int)(timeSpan.TotalDays / 365)} year{((int)(timeSpan.TotalDays / 365) != 1 ? "s" : "")} ago";
        }
    }
}