namespace Backend.DTOs.Portfolio
{
    public class AssetAllocation
    {
        public string Type { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public decimal Percentage { get; set; }
        public int Count { get; set; }
    }
}
