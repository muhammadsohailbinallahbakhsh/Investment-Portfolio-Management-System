namespace Backend.DTOs.Dashboard
{
    public class DashboardQuickStats
    {
        public decimal TodayGainLoss { get; set; }
        public decimal TodayGainLossPercentage { get; set; }
        public int TransactionsThisMonth { get; set; }
        public decimal InvestmentGrowthThisMonth { get; set; }
        public decimal InvestmentGrowthThisMonthPercentage { get; set; }
    }
}
