namespace Backend.DTOs.Reports
{
    public class TransactionDetailItem
    {
        public DateTime Date { get; set; }
        public string InvestmentName { get; set; } = string.Empty;
        public string InvestmentType { get; set; } = string.Empty;
        public string TransactionType { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal Amount { get; set; }
        public string? Notes { get; set; }
    }
}
