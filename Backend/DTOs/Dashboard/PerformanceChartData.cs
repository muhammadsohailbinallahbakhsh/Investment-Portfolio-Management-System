namespace Backend.DTOs.Dashboard
{
    public class PerformanceChartData
    {
        public List<string> Labels { get; set; } = new(); // ["Jan 2024", "Feb 2024", ...]
        public List<decimal> Values { get; set; } = new(); // [45000, 47000, 49000, ...]
        public List<decimal> InvestedValues { get; set; } = new(); // [40000, 42000, 44000, ...]
        public decimal CurrentValue { get; set; }
        public decimal StartValue { get; set; }
        public decimal TotalGrowth { get; set; }
        public decimal TotalGrowthPercentage { get; set; }
        public int MonthsCovered { get; set; }
        public string PeriodStart { get; set; } = string.Empty;
        public string PeriodEnd { get; set; } = string.Empty;
    }
}
