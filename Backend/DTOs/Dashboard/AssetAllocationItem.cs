namespace Backend.DTOs.Dashboard
{
    public class AssetAllocationItem
    {
        public string Type { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public decimal Percentage { get; set; }
        public int Count { get; set; }
        public string Color { get; set; } = string.Empty; // Hex color for chart
    }
}
