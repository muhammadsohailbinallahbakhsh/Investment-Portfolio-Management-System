namespace Backend.DTOs.Portfolio
{
    public class PortfolioStatsDto
    {
        public int PortfolioId { get; set; }
        public string PortfolioName { get; set; } = string.Empty;

        public decimal TotalInvested { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal TotalGainLossPercentage { get; set; }

        public int TotalInvestments { get; set; }
        public int ActiveInvestments { get; set; }
        public int SoldInvestments { get; set; }
        public int OnHoldInvestments { get; set; }

        public InvestmentPerformance? BestPerforming { get; set; }
        public InvestmentPerformance? WorstPerforming { get; set; }

        // Asset Allocation (for pie/donut chart)
        public List<AssetAllocation> AssetAllocation { get; set; } = new();
    }
}
