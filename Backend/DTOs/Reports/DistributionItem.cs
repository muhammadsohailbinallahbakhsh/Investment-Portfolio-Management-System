namespace Backend.DTOs.Reports
{
    public class DistributionItem
    {
        public string Category { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Value { get; set; }
        public decimal Percentage { get; set; }
        public string Color { get; set; } = string.Empty;
    }
}
