namespace Backend.DTOs.Reports
{
    public class TopPerformingInvestmentsReport
    {
        public string ReportTitle { get; set; } = "Top Performing Investments Report";
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public string PeriodStart { get; set; } = string.Empty;
        public string PeriodEnd { get; set; } = string.Empty;

        public int TotalInvestmentsAnalyzed { get; set; }

        // Top Performers by Gain/Loss Percentage
        public List<TopInvestmentItem> TopByPercentage { get; set; } = new();

        // Top Performers by Absolute Gain
        public List<TopInvestmentItem> TopByAbsoluteGain { get; set; } = new();

        // Top Performers by Current Value
        public List<TopInvestmentItem> TopByValue { get; set; } = new();

        // Performance by Type Summary
        public List<TypePerformanceSummary> TypePerformanceSummaries { get; set; } = new();
    }
}
