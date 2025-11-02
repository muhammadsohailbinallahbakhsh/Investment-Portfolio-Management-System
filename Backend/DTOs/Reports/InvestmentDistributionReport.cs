namespace Backend.DTOs.Reports
{
    public class InvestmentDistributionReport
    {
        public string ReportTitle { get; set; } = "Investment Distribution Report";
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        public decimal TotalPortfolioValue { get; set; }
        public int TotalInvestments { get; set; }

        // Distribution by Type
        public List<DistributionItem> DistributionByType { get; set; } = new();

        // Distribution by Status
        public List<DistributionItem> DistributionByStatus { get; set; } = new();

        // Investment Size Distribution
        public List<InvestmentSizeRange> InvestmentSizeDistribution { get; set; } = new();

        // Individual Investments
        public List<InvestmentDetailItem> Investments { get; set; } = new();
    }
}
