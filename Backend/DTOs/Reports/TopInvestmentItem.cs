namespace Backend.DTOs.Reports
{
    public class TopInvestmentItem
    {
        public int Rank { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal InitialAmount { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal GainLoss { get; set; }
        public decimal GainLossPercentage { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int DaysHeld { get; set; }
        public decimal AnnualizedReturn { get; set; }
    }
}
