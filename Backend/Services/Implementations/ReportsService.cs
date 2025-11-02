using Backend.DTOs.Reports;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using System.Text.Json;
using static Backend.AppCode.AppConstants;

namespace Backend.Services.Implementations
{
    public class ReportsService : IReportsService
    {
        private readonly IInvestmentRepository _investmentRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly ILogger<ReportsService> _logger;

        public ReportsService(
            IInvestmentRepository investmentRepository,
            ITransactionRepository transactionRepository,
            ILogger<ReportsService> logger)
        {
            _investmentRepository = investmentRepository;
            _transactionRepository = transactionRepository;
            _logger = logger;
        }

        // ==========================================
        // Performance Summary Report
        // ==========================================

        public async Task<PerformanceSummaryReport> GeneratePerformanceSummaryReportAsync(
            string userId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var transactionList = transactions.ToList();

            // Apply date filter if provided
            if (startDate.HasValue || endDate.HasValue)
            {
                var filterStartDate = startDate ?? DateTime.MinValue;
                var filterEndDate = endDate ?? DateTime.UtcNow;

                investmentList = investmentList
                    .Where(i => i.PurchaseDate >= filterStartDate && i.PurchaseDate <= filterEndDate)
                    .ToList();

                transactionList = transactionList
                    .Where(t => t.TransactionDate >= filterStartDate && t.TransactionDate <= filterEndDate)
                    .ToList();
            }

            var totalInvested = investmentList.Sum(i => i.InitialAmount);
            var currentValue = investmentList.Sum(i => i.CurrentValue);
            var totalGainLoss = currentValue - totalInvested;
            var totalGainLossPercentage = totalInvested > 0
                ? Math.Round((totalGainLoss / totalInvested) * 100, 2)
                : 0;

            // Investment breakdown
            var activeCount = investmentList.Count(i => i.Status == InvestmentStatus.Active);
            var soldCount = investmentList.Count(i => i.Status == InvestmentStatus.Sold);
            var onHoldCount = investmentList.Count(i => i.Status == InvestmentStatus.OnHold);

            // Transaction summary
            var buyTransactions = transactionList.Where(t => t.Type == TransactionType.Buy);
            var sellTransactions = transactionList.Where(t => t.Type == TransactionType.Sell);

            var totalBuyVolume = buyTransactions.Sum(t => t.Amount);
            var totalSellVolume = sellTransactions.Sum(t => t.Amount);

            // Top performers
            var topPerformers = investmentList
                .Where(i => i.InitialAmount > 0)
                .OrderByDescending(i => (i.CurrentValue - i.InitialAmount) / i.InitialAmount)
                .Take(5)
                .Select(i => new TopPerformerItem
                {
                    Name = i.Name,
                    Type = i.Type.ToString(),
                    InitialAmount = i.InitialAmount,
                    CurrentValue = i.CurrentValue,
                    GainLoss = i.CurrentValue - i.InitialAmount,
                    GainLossPercentage = Math.Round(((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100, 2)
                })
                .ToList();

            var worstPerformers = investmentList
                .Where(i => i.InitialAmount > 0)
                .OrderBy(i => (i.CurrentValue - i.InitialAmount) / i.InitialAmount)
                .Take(5)
                .Select(i => new TopPerformerItem
                {
                    Name = i.Name,
                    Type = i.Type.ToString(),
                    InitialAmount = i.InitialAmount,
                    CurrentValue = i.CurrentValue,
                    GainLoss = i.CurrentValue - i.InitialAmount,
                    GainLossPercentage = Math.Round(((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100, 2)
                })
                .ToList();

            // Performance by type
            var performanceByType = investmentList
                .GroupBy(i => i.Type.ToString())
                .Select(g =>
                {
                    var invested = g.Sum(i => i.InitialAmount);
                    var current = g.Sum(i => i.CurrentValue);
                    var gainLoss = current - invested;

                    return new PerformanceByTypeItem
                    {
                        Type = g.Key,
                        Count = g.Count(),
                        TotalInvested = invested,
                        CurrentValue = current,
                        GainLoss = gainLoss,
                        GainLossPercentage = invested > 0 ? Math.Round((gainLoss / invested) * 100, 2) : 0
                    };
                })
                .OrderByDescending(p => p.GainLossPercentage)
                .ToList();

            // Monthly trend (last 6 months)
            var monthlyTrend = GenerateMonthlyTrendData(investmentList, transactionList, 6);

            var periodStart = startDate?.ToString("MMM dd, yyyy") ?? "Beginning";
            var periodEnd = endDate?.ToString("MMM dd, yyyy") ?? DateTime.UtcNow.ToString("MMM dd, yyyy");

            return new PerformanceSummaryReport
            {
                GeneratedAt = DateTime.UtcNow,
                PeriodStart = periodStart,
                PeriodEnd = periodEnd,
                TotalInvested = totalInvested,
                CurrentValue = currentValue,
                TotalGainLoss = totalGainLoss,
                TotalGainLossPercentage = totalGainLossPercentage,
                TotalInvestments = investmentList.Count,
                ActiveInvestments = activeCount,
                SoldInvestments = soldCount,
                OnHoldInvestments = onHoldCount,
                TotalTransactions = transactionList.Count,
                TotalBuyVolume = totalBuyVolume,
                TotalSellVolume = totalSellVolume,
                TopPerformers = topPerformers,
                WorstPerformers = worstPerformers,
                PerformanceByType = performanceByType,
                MonthlyTrend = monthlyTrend
            };
        }

        // ==========================================
        // Investment Distribution Report
        // ==========================================

        public async Task<InvestmentDistributionReport> GenerateInvestmentDistributionReportAsync(
            string userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var totalValue = investmentList.Sum(i => i.CurrentValue);

            // Distribution by type
            var typeColors = new Dictionary<string, string>
            {
                { "Stocks", "#3b82f6" },
                { "Bonds", "#10b981" },
                { "RealEstate", "#f59e0b" },
                { "Crypto", "#8b5cf6" },
                { "MutualFunds", "#ec4899" },
                { "Other", "#6b7280" }
            };

            var distributionByType = investmentList
                .GroupBy(i => i.Type.ToString())
                .Select(g =>
                {
                    var value = g.Sum(i => i.CurrentValue);
                    return new DistributionItem
                    {
                        Category = g.Key,
                        Count = g.Count(),
                        Value = value,
                        Percentage = totalValue > 0 ? Math.Round((value / totalValue) * 100, 2) : 0,
                        Color = typeColors.ContainsKey(g.Key) ? typeColors[g.Key] : typeColors["Other"]
                    };
                })
                .OrderByDescending(d => d.Value)
                .ToList();

            // Distribution by status
            var statusColors = new Dictionary<string, string>
            {
                { "Active", "#10b981" },
                { "Sold", "#6b7280" },
                { "OnHold", "#f59e0b" }
            };

            var distributionByStatus = investmentList
                .GroupBy(i => i.Status.ToString())
                .Select(g =>
                {
                    var value = g.Sum(i => i.CurrentValue);
                    return new DistributionItem
                    {
                        Category = g.Key,
                        Count = g.Count(),
                        Value = value,
                        Percentage = totalValue > 0 ? Math.Round((value / totalValue) * 100, 2) : 0,
                        Color = statusColors.ContainsKey(g.Key) ? statusColors[g.Key] : "#6b7280"
                    };
                })
                .OrderByDescending(d => d.Count)
                .ToList();

            // Investment size distribution
            var sizeDistribution = new List<InvestmentSizeRange>
            {
                new() { Range = "< $1,000", Count = investmentList.Count(i => i.CurrentValue < 1000), TotalValue = investmentList.Where(i => i.CurrentValue < 1000).Sum(i => i.CurrentValue) },
                new() { Range = "$1,000 - $5,000", Count = investmentList.Count(i => i.CurrentValue >= 1000 && i.CurrentValue < 5000), TotalValue = investmentList.Where(i => i.CurrentValue >= 1000 && i.CurrentValue < 5000).Sum(i => i.CurrentValue) },
                new() { Range = "$5,000 - $10,000", Count = investmentList.Count(i => i.CurrentValue >= 5000 && i.CurrentValue < 10000), TotalValue = investmentList.Where(i => i.CurrentValue >= 5000 && i.CurrentValue < 10000).Sum(i => i.CurrentValue) },
                new() { Range = "$10,000 - $50,000", Count = investmentList.Count(i => i.CurrentValue >= 10000 && i.CurrentValue < 50000), TotalValue = investmentList.Where(i => i.CurrentValue >= 10000 && i.CurrentValue < 50000).Sum(i => i.CurrentValue) },
                new() { Range = "$50,000+", Count = investmentList.Count(i => i.CurrentValue >= 50000), TotalValue = investmentList.Where(i => i.CurrentValue >= 50000).Sum(i => i.CurrentValue) }
            };

            // Individual investments
            var investmentDetails = investmentList
                .Select(i => new InvestmentDetailItem
                {
                    Name = i.Name,
                    Type = i.Type.ToString(),
                    Status = i.Status.ToString(),
                    InitialAmount = i.InitialAmount,
                    CurrentValue = i.CurrentValue,
                    GainLoss = i.CurrentValue - i.InitialAmount,
                    GainLossPercentage = i.InitialAmount > 0 ? Math.Round(((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100, 2) : 0,
                    PurchaseDate = i.PurchaseDate
                })
                .OrderByDescending(i => i.CurrentValue)
                .ToList();

            return new InvestmentDistributionReport
            {
                GeneratedAt = DateTime.UtcNow,
                TotalPortfolioValue = totalValue,
                TotalInvestments = investmentList.Count,
                DistributionByType = distributionByType,
                DistributionByStatus = distributionByStatus,
                InvestmentSizeDistribution = sizeDistribution,
                Investments = investmentDetails
            };
        }

        public async Task<TransactionHistoryReport> GenerateTransactionHistoryReportAsync(
              string userId,
              DateTime? startDate = null,
              DateTime? endDate = null)
        {
            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var transactionList = transactions.ToList();

            // Apply date filter
            if (startDate.HasValue || endDate.HasValue)
            {
                var filterStartDate = startDate ?? DateTime.MinValue;
                var filterEndDate = endDate ?? DateTime.UtcNow;

                transactionList = transactionList
                    .Where(t => t.TransactionDate >= filterStartDate && t.TransactionDate <= filterEndDate)
                    .ToList();
            }

            var totalVolume = transactionList.Sum(t => t.Amount);

            var buyTransactions = transactionList.Where(t => t.Type == TransactionType.Buy).ToList();
            var sellTransactions = transactionList.Where(t => t.Type == TransactionType.Sell).ToList();
            var updateTransactions = transactionList.Where(t => t.Type == TransactionType.Update).ToList();

            // Transactions by type
            var transactionsByType = new List<TransactionsByTypeItem>
            {
                new()
                {
                    Type = "Buy",
                    Count = buyTransactions.Count,
                    Volume = buyTransactions.Sum(t => t.Amount),
                    Percentage = totalVolume > 0 ? Math.Round((buyTransactions.Sum(t => t.Amount) / totalVolume) * 100, 2) : 0
                },
                new()
                {
                    Type = "Sell",
                    Count = sellTransactions.Count,
                    Volume = sellTransactions.Sum(t => t.Amount),
                    Percentage = totalVolume > 0 ? Math.Round((sellTransactions.Sum(t => t.Amount) / totalVolume) * 100, 2) : 0
                },
                new()
                {
                    Type = "Update",
                    Count = updateTransactions.Count,
                    Volume = updateTransactions.Sum(t => t.Amount),
                    Percentage = totalVolume > 0 ? Math.Round((updateTransactions.Sum(t => t.Amount) / totalVolume) * 100, 2) : 0
                }
            };

            // Transactions by month
            var transactionsByMonth = transactionList
                .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
                .Select(g => new TransactionsByMonthItem
                {
                    Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                    Count = g.Count(),
                    Volume = g.Sum(t => t.Amount)
                })
                .OrderByDescending(t => DateTime.Parse(t.Month + " 01"))
                .ToList();

            // Detailed transactions
            var transactionDetails = transactionList
                .OrderByDescending(t => t.TransactionDate)
                .Select(t => new TransactionDetailItem
                {
                    Date = t.TransactionDate,
                    InvestmentName = t.Investment?.Name ?? "Unknown",
                    InvestmentType = t.Investment?.Type.ToString() ?? "Unknown",
                    TransactionType = t.Type.ToString(),
                    Quantity = t.Quantity,
                    PricePerUnit = t.PricePerUnit,
                    Amount = t.Amount,
                    Notes = t.Notes
                })
                .ToList();

            var periodStart = startDate?.ToString("MMM dd, yyyy") ?? "Beginning";
            var periodEnd = endDate?.ToString("MMM dd, yyyy") ?? DateTime.UtcNow.ToString("MMM dd, yyyy");

            return new TransactionHistoryReport
            {
                GeneratedAt = DateTime.UtcNow,
                PeriodStart = periodStart,
                PeriodEnd = periodEnd,
                TotalTransactions = transactionList.Count,
                TotalVolume = totalVolume,
                BuyTransactions = buyTransactions.Count,
                BuyVolume = buyTransactions.Sum(t => t.Amount),
                SellTransactions = sellTransactions.Count,
                SellVolume = sellTransactions.Sum(t => t.Amount),
                UpdateTransactions = updateTransactions.Count,
                TransactionsByType = transactionsByType,
                TransactionsByMonth = transactionsByMonth,
                Transactions = transactionDetails
            };
        }

        // ==========================================
        // Monthly Performance Trend Report
        // ==========================================

        public async Task<MonthlyPerformanceTrendReport> GenerateMonthlyPerformanceTrendReportAsync(
            string userId,
            int months = 12)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var transactionList = transactions.ToList();

            var monthlyData = new List<MonthPerformanceItem>();
            var chartLabels = new List<string>();
            var chartValues = new List<decimal>();
            var chartInvestedValues = new List<decimal>();

            var endDate = DateTime.UtcNow;
            var startDate = endDate.AddMonths(-months);

            for (int i = months - 1; i >= 0; i--)
            {
                var monthDate = endDate.AddMonths(-i);
                var monthStart = new DateTime(monthDate.Year, monthDate.Month, 1);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);

                var startValue = CalculatePortfolioValueAtDate(investmentList, transactionList, monthStart.AddDays(-1));
                var endValue = CalculatePortfolioValueAtDate(investmentList, transactionList, monthEnd);
                var growth = endValue - startValue;
                var growthPercentage = startValue > 0 ? Math.Round((growth / startValue) * 100, 2) : 0;

                var monthTransactions = transactionList.Where(t =>
                    t.TransactionDate >= monthStart && t.TransactionDate <= monthEnd).ToList();

                monthlyData.Add(new MonthPerformanceItem
                {
                    Month = monthStart.ToString("MMM yyyy"),
                    StartValue = startValue,
                    EndValue = endValue,
                    Growth = growth,
                    GrowthPercentage = growthPercentage,
                    TransactionCount = monthTransactions.Count,
                    TransactionVolume = monthTransactions.Sum(t => t.Amount)
                });

                chartLabels.Add(monthStart.ToString("MMM yyyy"));
                chartValues.Add(endValue);
                chartInvestedValues.Add(CalculateInvestedAmountAtDate(investmentList, transactionList, monthEnd));
            }

            var startingValue = monthlyData.FirstOrDefault()?.StartValue ?? 0;
            var endingValue = monthlyData.LastOrDefault()?.EndValue ?? 0;
            var totalGrowth = endingValue - startingValue;
            var totalGrowthPercentage = startingValue > 0 ? Math.Round((totalGrowth / startingValue) * 100, 2) : 0;

            var bestMonth = monthlyData.OrderByDescending(m => m.GrowthPercentage).FirstOrDefault();
            var worstMonth = monthlyData.OrderBy(m => m.GrowthPercentage).FirstOrDefault();

            var averageMonthlyGrowth = monthlyData.Average(m => m.Growth);
            var averageMonthlyGrowthPercentage = monthlyData.Average(m => m.GrowthPercentage);

            return new MonthlyPerformanceTrendReport
            {
                GeneratedAt = DateTime.UtcNow,
                MonthsCovered = months,
                StartingValue = startingValue,
                EndingValue = endingValue,
                TotalGrowth = totalGrowth,
                TotalGrowthPercentage = totalGrowthPercentage,
                BestMonth = bestMonth,
                WorstMonth = worstMonth,
                AverageMonthlyGrowth = averageMonthlyGrowth,
                AverageMonthlyGrowthPercentage = Math.Round(averageMonthlyGrowthPercentage, 2),
                MonthlyData = monthlyData,
                ChartLabels = chartLabels,
                ChartValues = chartValues,
                ChartInvestedValues = chartInvestedValues
            };
        }

        // ==========================================
        // Year-over-Year Report
        // ==========================================

        public async Task<YearOverYearReport> GenerateYearOverYearReportAsync(string userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var transactionList = transactions.ToList();

            // Get earliest year from investments
            var earliestYear = investmentList.Any()
                ? investmentList.Min(i => i.PurchaseDate).Year
                : DateTime.UtcNow.Year;

            var currentYear = DateTime.UtcNow.Year;
            var years = new List<int>();

            for (int year = earliestYear; year <= currentYear; year++)
            {
                years.Add(year);
            }

            var yearlySummaries = new List<YearSummaryItem>();
            var chartLabels = new List<string>();
            var chartEndingValues = new List<decimal>();
            var chartGrowthPercentages = new List<decimal>();

            foreach (var year in years)
            {
                var yearStart = new DateTime(year, 1, 1);
                var yearEnd = new DateTime(year, 12, 31);

                var startValue = CalculatePortfolioValueAtDate(investmentList, transactionList, yearStart.AddDays(-1));
                var endValue = CalculatePortfolioValueAtDate(investmentList, transactionList, yearEnd);
                var invested = CalculateInvestedAmountAtDate(investmentList, transactionList, yearEnd);
                var growth = endValue - startValue;
                var growthPercentage = startValue > 0 ? Math.Round((growth / startValue) * 100, 2) : 0;

                var yearTransactions = transactionList.Where(t => t.TransactionDate.Year == year).ToList();
                var newInvestments = investmentList.Count(i => i.PurchaseDate.Year == year);

                yearlySummaries.Add(new YearSummaryItem
                {
                    Year = year,
                    StartingValue = startValue,
                    EndingValue = endValue,
                    TotalInvested = invested,
                    Growth = growth,
                    GrowthPercentage = growthPercentage,
                    TotalTransactions = yearTransactions.Count,
                    TransactionVolume = yearTransactions.Sum(t => t.Amount),
                    NewInvestments = newInvestments
                });

                chartLabels.Add(year.ToString());
                chartEndingValues.Add(endValue);
                chartGrowthPercentages.Add(growthPercentage);
            }

            // Year-over-year growth comparisons
            var yoyGrowth = new List<YearOverYearGrowthItem>();
            for (int i = 1; i < yearlySummaries.Count; i++)
            {
                var currentYearData = yearlySummaries[i];
                var previousYearData = yearlySummaries[i - 1];

                var growthDifference = currentYearData.Growth - previousYearData.Growth;
                var growthDifferencePercentage = previousYearData.Growth != 0
                    ? Math.Round((growthDifference / Math.Abs(previousYearData.Growth)) * 100, 2)
                    : 0;

                var transactionDifference = currentYearData.TotalTransactions - previousYearData.TotalTransactions;

                yoyGrowth.Add(new YearOverYearGrowthItem
                {
                    Comparison = $"{currentYearData.Year} vs {previousYearData.Year}",
                    GrowthDifference = growthDifference,
                    GrowthDifferencePercentage = growthDifferencePercentage,
                    TransactionCountDifference = transactionDifference
                });
            }

            var bestYear = yearlySummaries.OrderByDescending(y => y.GrowthPercentage).FirstOrDefault();
            var worstYear = yearlySummaries.OrderBy(y => y.GrowthPercentage).FirstOrDefault();

            return new YearOverYearReport
            {
                GeneratedAt = DateTime.UtcNow,
                YearsCovered = years,
                YearlySummaries = yearlySummaries,
                YearOverYearGrowth = yoyGrowth,
                BestYear = bestYear,
                WorstYear = worstYear,
                ChartLabels = chartLabels,
                ChartEndingValues = chartEndingValues,
                ChartGrowthPercentages = chartGrowthPercentages
            };
        }


        public async Task<TopPerformingInvestmentsReport> GenerateTopPerformingInvestmentsReportAsync(
            string userId,
            DateTime? startDate = null,
            DateTime? endDate = null,
            int topCount = 10)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var investmentList = investments.ToList();

            // Apply date filter
            if (startDate.HasValue || endDate.HasValue)
            {
                var filterStartDate = startDate ?? DateTime.MinValue;
                var filterEndDate = endDate ?? DateTime.UtcNow;

                investmentList = investmentList
                    .Where(i => i.PurchaseDate >= filterStartDate && i.PurchaseDate <= filterEndDate)
                    .ToList();
            }

            var now = DateTime.UtcNow;

            // Top by percentage
            var topByPercentage = investmentList
                .Where(i => i.InitialAmount > 0)
                .Select((i, index) =>
                {
                    var daysHeld = (now - i.PurchaseDate).Days;
                    var years = daysHeld / 365.0;
                    var annualizedReturn = years > 0
                        ? Math.Round(Math.Pow((double)(i.CurrentValue / i.InitialAmount), 1 / years) - 1, 4) * 100
                        : 0;

                    return new TopInvestmentItem
                    {
                        Rank = 0, // Will be set after ordering
                        Name = i.Name,
                        Type = i.Type.ToString(),
                        Status = i.Status.ToString(),
                        InitialAmount = i.InitialAmount,
                        CurrentValue = i.CurrentValue,
                        GainLoss = i.CurrentValue - i.InitialAmount,
                        GainLossPercentage = Math.Round(((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100, 2),
                        PurchaseDate = i.PurchaseDate,
                        DaysHeld = daysHeld,
                        AnnualizedReturn = (decimal)annualizedReturn
                    };
                })
                .OrderByDescending(i => i.GainLossPercentage)
                .Take(topCount)
                .Select((item, index) =>
                {
                    item.Rank = index + 1;
                    return item;
                })
                .ToList();

            // Top by absolute gain
            var topByAbsoluteGain = investmentList
                .Where(i => i.InitialAmount > 0)
                .Select((i, index) =>
                {
                    var daysHeld = (now - i.PurchaseDate).Days;
                    var years = daysHeld / 365.0;
                    var annualizedReturn = years > 0
                        ? Math.Round(Math.Pow((double)(i.CurrentValue / i.InitialAmount), 1 / years) - 1, 4) * 100
                        : 0;

                    return new TopInvestmentItem
                    {
                        Rank = 0,
                        Name = i.Name,
                        Type = i.Type.ToString(),
                        Status = i.Status.ToString(),
                        InitialAmount = i.InitialAmount,
                        CurrentValue = i.CurrentValue,
                        GainLoss = i.CurrentValue - i.InitialAmount,
                        GainLossPercentage = Math.Round(((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100, 2),
                        PurchaseDate = i.PurchaseDate,
                        DaysHeld = daysHeld,
                        AnnualizedReturn = (decimal)annualizedReturn
                    };
                })
                .OrderByDescending(i => i.GainLoss)
                .Take(topCount)
                .Select((item, index) =>
                {
                    item.Rank = index + 1;
                    return item;
                })
                .ToList();

            // Top by current value
            var topByValue = investmentList
                .Select((i, index) =>
                {
                    var daysHeld = (now - i.PurchaseDate).Days;
                    var years = daysHeld / 365.0;
                    var annualizedReturn = years > 0 && i.InitialAmount > 0
                        ? Math.Round(Math.Pow((double)(i.CurrentValue / i.InitialAmount), 1 / years) - 1, 4) * 100
                        : 0;

                    return new TopInvestmentItem
                    {
                        Rank = 0,
                        Name = i.Name,
                        Type = i.Type.ToString(),
                        Status = i.Status.ToString(),
                        InitialAmount = i.InitialAmount,
                        CurrentValue = i.CurrentValue,
                        GainLoss = i.CurrentValue - i.InitialAmount,
                        GainLossPercentage = i.InitialAmount > 0 ? Math.Round(((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100, 2) : 0,
                        PurchaseDate = i.PurchaseDate,
                        DaysHeld = daysHeld,
                        AnnualizedReturn = (decimal)annualizedReturn
                    };
                })
                .OrderByDescending(i => i.CurrentValue)
                .Take(topCount)
                .Select((item, index) =>
                {
                    item.Rank = index + 1;
                    return item;
                })
                .ToList();

            // Performance by type
            var typePerformance = investmentList
                .Where(i => i.InitialAmount > 0)
                .GroupBy(i => i.Type.ToString())
                .Select(g =>
                {
                    var items = g.Select(i => ((i.CurrentValue - i.InitialAmount) / i.InitialAmount) * 100).ToList();

                    return new TypePerformanceSummary
                    {
                        Type = g.Key,
                        Count = g.Count(),
                        AverageGainLossPercentage = Math.Round(items.Average(), 2),
                        BestPerformancePercentage = Math.Round(items.Max(), 2),
                        WorstPerformancePercentage = Math.Round(items.Min(), 2)
                    };
                })
                .OrderByDescending(t => t.AverageGainLossPercentage)
                .ToList();

            var periodStart = startDate?.ToString("MMM dd, yyyy") ?? "Beginning";
            var periodEnd = endDate?.ToString("MMM dd, yyyy") ?? DateTime.UtcNow.ToString("MMM dd, yyyy");

            return new TopPerformingInvestmentsReport
            {
                GeneratedAt = DateTime.UtcNow,
                PeriodStart = periodStart,
                PeriodEnd = periodEnd,
                TotalInvestmentsAnalyzed = investmentList.Count,
                TopByPercentage = topByPercentage,
                TopByAbsoluteGain = topByAbsoluteGain,
                TopByValue = topByValue,
                TypePerformanceSummaries = typePerformance
            };
        }

        // ==========================================
        // Export Functions
        // ==========================================

        public async Task<byte[]> ExportReportToCsvAsync(
            string userId,
            string reportType,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            var csv = new System.Text.StringBuilder();

            switch (reportType.ToLower())
            {
                case "performance":
                    var perfReport = await GeneratePerformanceSummaryReportAsync(userId, startDate, endDate);
                    csv.AppendLine("Performance Summary Report");
                    csv.AppendLine($"Generated: {perfReport.GeneratedAt:yyyy-MM-dd HH:mm:ss}");
                    csv.AppendLine($"Period: {perfReport.PeriodStart} to {perfReport.PeriodEnd}");
                    csv.AppendLine();
                    csv.AppendLine("Overall Performance");
                    csv.AppendLine("Total Invested,Current Value,Gain/Loss,Gain/Loss %");
                    csv.AppendLine($"{perfReport.TotalInvested},{perfReport.CurrentValue},{perfReport.TotalGainLoss},{perfReport.TotalGainLossPercentage}%");
                    csv.AppendLine();
                    csv.AppendLine("Top Performers");
                    csv.AppendLine("Name,Type,Initial,Current,Gain/Loss,Gain/Loss %");
                    foreach (var item in perfReport.TopPerformers)
                    {
                        csv.AppendLine($"\"{item.Name}\",{item.Type},{item.InitialAmount},{item.CurrentValue},{item.GainLoss},{item.GainLossPercentage}%");
                    }
                    break;

                case "transactions":
                    var txReport = await GenerateTransactionHistoryReportAsync(userId, startDate, endDate);
                    csv.AppendLine("Transaction History Report");
                    csv.AppendLine($"Generated: {txReport.GeneratedAt:yyyy-MM-dd HH:mm:ss}");
                    csv.AppendLine($"Period: {txReport.PeriodStart} to {txReport.PeriodEnd}");
                    csv.AppendLine();
                    csv.AppendLine("Date,Investment,Type,Transaction Type,Quantity,Price,Amount,Notes");
                    foreach (var tx in txReport.Transactions)
                    {
                        csv.AppendLine($"{tx.Date:yyyy-MM-dd},\"{tx.InvestmentName}\",{tx.InvestmentType},{tx.TransactionType},{tx.Quantity},{tx.PricePerUnit},{tx.Amount},\"{tx.Notes}\"");
                    }
                    break;

                default:
                    csv.AppendLine("Unsupported report type for CSV export");
                    break;
            }

            return System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        }

        public async Task<string> ExportReportToJsonAsync(
            string userId,
            string reportType,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            object report = reportType.ToLower() switch
            {
                "performance" => await GeneratePerformanceSummaryReportAsync(userId, startDate, endDate),
                "distribution" => await GenerateInvestmentDistributionReportAsync(userId),
                "transactions" => await GenerateTransactionHistoryReportAsync(userId, startDate, endDate),
                "monthly" => await GenerateMonthlyPerformanceTrendReportAsync(userId, 12),
                "yearoveryear" => await GenerateYearOverYearReportAsync(userId),
                "topperforming" => await GenerateTopPerformingInvestmentsReportAsync(userId, startDate, endDate, 10),
                _ => new { error = "Unsupported report type" }
            };

            return JsonSerializer.Serialize(report, new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        }

        public async Task<object> ExportReportToPdfAsync(
            string userId,
            string reportType,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            // PDF export is simulated - return JSON with PDF metadata
            var reportData = await ExportReportToJsonAsync(userId, reportType, startDate, endDate);

            return new
            {
                format = "PDF",
                simulated = true,
                message = "PDF export is simulated. In production, this would generate a PDF file.",
                filename = $"{reportType}_report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.pdf",
                contentType = "application/pdf",
                data = reportData,
                metadata = new
                {
                    generatedAt = DateTime.UtcNow,
                    userId = userId,
                    reportType = reportType,
                    dateRange = new
                    {
                        start = startDate?.ToString("yyyy-MM-dd"),
                        end = endDate?.ToString("yyyy-MM-dd")
                    }
                }
            };
        }

        // ==========================================
        // Helper Methods
        // ==========================================

        public (DateTime startDate, DateTime endDate) ParsePresetDateRange(string? presetRange)
        {
            var endDate = DateTime.UtcNow;
            DateTime startDate;

            switch (presetRange?.ToLower())
            {
                case "last7days":
                    startDate = endDate.AddDays(-7);
                    break;
                case "last30days":
                    startDate = endDate.AddDays(-30);
                    break;
                case "last3months":
                    startDate = endDate.AddMonths(-3);
                    break;
                case "last6months":
                    startDate = endDate.AddMonths(-6);
                    break;
                case "last12months":
                    startDate = endDate.AddMonths(-12);
                    break;
                case "thisyear":
                    startDate = new DateTime(endDate.Year, 1, 1);
                    break;
                case "lastyear":
                    startDate = new DateTime(endDate.Year - 1, 1, 1);
                    endDate = new DateTime(endDate.Year - 1, 12, 31);
                    break;
                case "alltime":
                default:
                    startDate = DateTime.MinValue;
                    break;
            }

            return (startDate, endDate);
        }

        public List<string> GetAvailableReportTypes()
        {
            return new List<string>
            {
                "performance",
                "distribution",
                "transactions",
                "monthly",
                "yearOverYear",
                "topPerforming"
            };
        }

        // Private helper methods

        private List<MonthlyTrendItem> GenerateMonthlyTrendData(
            List<Backend.Models.Investment> investments,
            List<Backend.Models.Transaction> transactions,
            int months)
        {
            var monthlyTrend = new List<MonthlyTrendItem>();
            var endDate = DateTime.UtcNow;

            for (int i = months - 1; i >= 0; i--)
            {
                var monthDate = endDate.AddMonths(-i);
                var monthStart = new DateTime(monthDate.Year, monthDate.Month, 1);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);

                var value = CalculatePortfolioValueAtDate(investments, transactions, monthEnd);
                var invested = CalculateInvestedAmountAtDate(investments, transactions, monthEnd);
                var gainLoss = value - invested;
                var gainLossPercentage = invested > 0 ? Math.Round((gainLoss / invested) * 100, 2) : 0;

                monthlyTrend.Add(new MonthlyTrendItem
                {
                    Month = monthStart.ToString("MMM yyyy"),
                    Value = value,
                    InvestedAmount = invested,
                    GainLoss = gainLoss,
                    GainLossPercentage = gainLossPercentage
                });
            }

            return monthlyTrend;
        }

        private decimal CalculatePortfolioValueAtDate(
            List<Backend.Models.Investment> investments,
            List<Backend.Models.Transaction> transactions,
            DateTime date)
        {
            decimal totalValue = 0;

            foreach (var investment in investments.Where(i => i.PurchaseDate <= date))
            {
                var investmentTransactions = transactions
                    .Where(t => t.InvestmentId == investment.Id && t.TransactionDate <= date)
                    .OrderBy(t => t.TransactionDate)
                    .ToList();

                if (!investmentTransactions.Any())
                {
                    totalValue += investment.InitialAmount;
                }
                else
                {
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

    }
}