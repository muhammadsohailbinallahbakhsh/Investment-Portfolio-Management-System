using Backend.DTOs.Dashboard;

namespace Backend.Services.Interfaces
{
    public interface IDashboardService
    {
        // ==========================================
        // Main Dashboard Data
        // ==========================================

        Task<UserDashboardDto> GetUserDashboardAsync(string userId);

        Task<PortfolioSummaryCards> GetSummaryCardsAsync(string userId);

        // ==========================================
        // Recent Transactions
        // ==========================================

        Task<List<RecentTransactionDto>> GetRecentTransactionsAsync(string userId, int count = 10);

        // ==========================================
        // Performance Chart
        // ==========================================

        Task<PerformanceChartData> GetPerformanceChartDataAsync(string userId, int months = 12);

        Task<List<MonthlyPerformanceSummary>> GetMonthlyPerformanceSummariesAsync(
            string userId, int months = 12);

        // ==========================================
        // Asset Allocation
        // ==========================================

        Task<AssetAllocationData> GetAssetAllocationAsync(string userId);

        // ==========================================
        // Additional Dashboard Data
        // ==========================================

        Task<DashboardQuickStats> GetQuickStatsAsync(string userId);

        Task<PortfolioBreakdown> GetPortfolioBreakdownAsync(string userId);

        Task<List<InvestmentPerformanceCard>> GetTopPerformingInvestmentsAsync(
            string userId, int count = 5);

        Task<List<InvestmentPerformanceCard>> GetWorstPerformingInvestmentsAsync(
            string userId, int count = 5);
    }
}