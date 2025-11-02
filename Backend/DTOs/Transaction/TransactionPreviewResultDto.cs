namespace Backend.DTOs.Transaction
{
    public class TransactionPreviewResultDto
    {
        public string InvestmentName { get; set; } = string.Empty;
        public decimal CurrentValue { get; set; }
        public decimal TransactionAmount { get; set; }
        public decimal NewTotalValue { get; set; }
        public decimal ValueChange { get; set; }
        public decimal ValueChangePercentage { get; set; }
        public bool IsValid { get; set; }
        public string? ValidationMessage { get; set; }

        // For Update type
        public decimal? NewQuantity { get; set; }
        public decimal? NewAveragePricePerUnit { get; set; }
    }
}