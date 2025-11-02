namespace Backend.DTOs.Reports
{
    public class TypePerformanceSummary
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal AverageGainLossPercentage { get; set; }
        public decimal BestPerformancePercentage { get; set; }
        public decimal WorstPerformancePercentage { get; set; }
    }
}
