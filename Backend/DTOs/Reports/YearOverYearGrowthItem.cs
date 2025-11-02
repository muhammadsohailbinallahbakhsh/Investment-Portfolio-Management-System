namespace Backend.DTOs.Reports
{
    public class YearOverYearGrowthItem
    {
        public string Comparison { get; set; } = string.Empty; // "2024 vs 2023"
        public decimal GrowthDifference { get; set; }
        public decimal GrowthDifferencePercentage { get; set; }
        public int TransactionCountDifference { get; set; }
    }
}
