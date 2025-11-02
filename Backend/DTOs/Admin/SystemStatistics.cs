namespace Backend.DTOs.Admin
{
    public class SystemStatistics
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }

        public int TotalPortfolios { get; set; }
        public decimal TotalInvestmentsValue { get; set; }
        public int TotalInvestments { get; set; }

        public int ActiveTransactionsToday { get; set; }
        public int TotalTransactionsToday { get; set; }
        public decimal TransactionVolumeToday { get; set; }

        public int TotalTransactions { get; set; }

        public int NewUsersThisWeek { get; set; }
        public int NewUsersThisMonth { get; set; }
        public decimal InvestmentGrowthPercentage { get; set; }
    }
}
