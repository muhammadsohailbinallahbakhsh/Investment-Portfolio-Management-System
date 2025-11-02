namespace Backend.DTOs.Reports
{
    public class PerformanceSummaryReport
    {
        public string ReportTitle { get; set; } = "Performance Summary Report";
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public string PeriodStart { get; set; } = string.Empty;
        public string PeriodEnd { get; set; } = string.Empty;

        // Overall Performance
        public decimal TotalInvested { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal TotalGainLossPercentage { get; set; }

        // Investment Breakdown
        public int TotalInvestments { get; set; }
        public int ActiveInvestments { get; set; }
        public int SoldInvestments { get; set; }
        public int OnHoldInvestments { get; set; }

        // Transaction Summary
        public int TotalTransactions { get; set; }
        public decimal TotalBuyVolume { get; set; }
        public decimal TotalSellVolume { get; set; }

        // Top Performers
        public List<TopPerformerItem> TopPerformers { get; set; } = new();
        public List<TopPerformerItem> WorstPerformers { get; set; } = new();

        // Performance by Type
        public List<PerformanceByTypeItem> PerformanceByType { get; set; } = new();

        // Monthly Trend
        public List<MonthlyTrendItem> MonthlyTrend { get; set; } = new();
    }
}
