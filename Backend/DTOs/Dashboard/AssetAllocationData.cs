namespace Backend.DTOs.Dashboard
{
    public class AssetAllocationData
    {
        public List<AssetAllocationItem> Allocations { get; set; } = new();
        public decimal TotalValue { get; set; }
        public int TotalInvestments { get; set; }
    }
}
