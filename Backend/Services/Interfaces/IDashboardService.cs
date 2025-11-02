using Backend.DTOs.Dashboard;

namespace Backend.Services.Interfaces
{
    /// <summary>
    /// Service for user dashboard (portfolio owner) operations
    /// </summary>
    public interface IDashboardService
    {
        // ==========================================
        // Main Dashboard Data
        // ==========================================

        /// <summary>
        /// Get complete dashboard data for user
        /// Includes: Summary cards, recent transactions, performance chart, asset allocation
        /// </summary>
        Task<UserDashboardDto> GetUserDashboardAsync(string userId);

        /// <summary>
        /// Get portfolio summary cards data
        /// </summary>
        Task<PortfolioSummaryCards> GetSummaryCardsAsync(string userId);

        // ==========================================
        // Recent Transactions
        // ==========================================

        /// <summary>
        /// Get recent transactions for dashboard (last 10 by default)
        /// </summary>
        Task<List<RecentTransactionDto>> GetRecentTransactionsAsync(string userId, int count = 10);

        // ==========================================
        // Performance Chart
        // ==========================================

        /// <summary>
        /// Get performance chart data (line/area chart - 12 months by default)
        /// Shows value progression over time
        /// </summary>
        Task<PerformanceChartData> GetPerformanceChartDataAsync(string userId, int months = 12);

        /// <summary>
        /// Get monthly performance summaries
        /// </summary>
        Task<List<MonthlyPerformanceSummary>> GetMonthlyPerformanceSummariesAsync(
            string userId, int months = 12);

        // ==========================================
        // Asset Allocation
        // ==========================================

        /// <summary>
        /// Get asset allocation data (pie/donut chart by investment type)
        /// </summary>
        Task<AssetAllocationData> GetAssetAllocationAsync(string userId);

        // ==========================================
        // Additional Dashboard Data
        // ==========================================

        /// <summary>
        /// Get quick stats for dashboard header
        /// </summary>
        Task<DashboardQuickStats> GetQuickStatsAsync(string userId);

        /// <summary>
        /// Get portfolio breakdown by status
        /// </summary>
        Task<PortfolioBreakdown> GetPortfolioBreakdownAsync(string userId);

        /// <summary>
        /// Get top performing investments
        /// </summary>
        Task<List<InvestmentPerformanceCard>> GetTopPerformingInvestmentsAsync(
            string userId, int count = 5);

        /// <summary>
        /// Get worst performing investments
        /// </summary>
        Task<List<InvestmentPerformanceCard>> GetWorstPerformingInvestmentsAsync(
            string userId, int count = 5);
    }
}