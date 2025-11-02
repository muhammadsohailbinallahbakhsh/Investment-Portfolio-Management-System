namespace Backend.DTOs.Reports
{
    public class MonthlyPerformanceTrendReport
    {
        public string ReportTitle { get; set; } = "Monthly Performance Trend Report";
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public int MonthsCovered { get; set; }

        // Overall Summary
        public decimal StartingValue { get; set; }
        public decimal EndingValue { get; set; }
        public decimal TotalGrowth { get; set; }
        public decimal TotalGrowthPercentage { get; set; }

        // Best and Worst Months
        public MonthPerformanceItem? BestMonth { get; set; }
        public MonthPerformanceItem? WorstMonth { get; set; }

        // Average Monthly Performance
        public decimal AverageMonthlyGrowth { get; set; }
        public decimal AverageMonthlyGrowthPercentage { get; set; }

        // Monthly Data
        public List<MonthPerformanceItem> MonthlyData { get; set; } = new();

        // Chart Data
        public List<string> ChartLabels { get; set; } = new();
        public List<decimal> ChartValues { get; set; } = new();
        public List<decimal> ChartInvestedValues { get; set; } = new();
    }
}
