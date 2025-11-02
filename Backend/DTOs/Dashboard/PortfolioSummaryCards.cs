namespace Backend.DTOs.Dashboard
{
    public class PortfolioSummaryCards
    {
        public decimal TotalInvestmentValue { get; set; }
        public decimal TotalInvested { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal TotalGainLossPercentage { get; set; }
        public int NumberOfActiveInvestments { get; set; }
        public int TotalInvestments { get; set; }

        public InvestmentPerformanceCard? BestPerforming { get; set; }
        public InvestmentPerformanceCard? WorstPerforming { get; set; }

        // Additional useful metrics
        public int TotalTransactions { get; set; }
        public DateTime? LastTransactionDate { get; set; }
        public int PortfolioCount { get; set; }
    }
}
