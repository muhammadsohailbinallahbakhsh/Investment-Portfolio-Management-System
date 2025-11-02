namespace Backend.DTOs.Dashboard
{
    public class UserDashboardDto
    {
        public PortfolioSummaryCards SummaryCards { get; set; } = new();
        public List<RecentTransactionDto> RecentTransactions { get; set; } = new();
        public PerformanceChartData PerformanceChart { get; set; } = new();
        public AssetAllocationData AssetAllocation { get; set; } = new();
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
