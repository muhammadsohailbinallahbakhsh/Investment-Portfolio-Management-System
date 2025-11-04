namespace Backend.DTOs.Dashboard
{
    /// <summary>
    /// Asset Allocation Data for Chart Display
    /// Contains labels (investment types) and values (amounts)
    /// </summary>
    public class AssetAllocationData
    {
        /// <summary>
        /// Investment type labels (e.g., "Stocks", "Bonds", "Real Estate")
        /// </summary>
        public List<string> Labels { get; set; } = new();

        /// <summary>
        /// Investment values corresponding to each label
        /// </summary>
        public List<decimal> Values { get; set; } = new();

        /// <summary>
        /// Total portfolio value
        /// </summary>
        public decimal TotalValue { get; set; }

        /// <summary>
        /// Total number of investments
        /// </summary>
        public int TotalInvestments { get; set; }
    }
}
