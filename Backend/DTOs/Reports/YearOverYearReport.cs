namespace Backend.DTOs.Reports
{
    public class YearOverYearReport
    {
        public string ReportTitle { get; set; } = "Year-over-Year Comparison Report";
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        // Years Covered
        public List<int> YearsCovered { get; set; } = new();

        // Yearly Summaries
        public List<YearSummaryItem> YearlySummaries { get; set; } = new();

        // Year-over-Year Growth
        public List<YearOverYearGrowthItem> YearOverYearGrowth { get; set; } = new();

        // Best and Worst Years
        public YearSummaryItem? BestYear { get; set; }
        public YearSummaryItem? WorstYear { get; set; }

        // Chart Data (for visualization)
        public List<string> ChartLabels { get; set; } = new();
        public List<decimal> ChartEndingValues { get; set; } = new();
        public List<decimal> ChartGrowthPercentages { get; set; } = new();
    }
}
