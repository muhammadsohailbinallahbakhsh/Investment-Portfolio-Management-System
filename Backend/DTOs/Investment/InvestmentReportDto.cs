namespace Backend.DTOs.Investment
{
    public class InvestmentReportDto
    {
        public string InvestmentName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal InitialAmount { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal GainLoss { get; set; }
        public decimal GainLossPercentage { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int TotalTransactions { get; set; }
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}