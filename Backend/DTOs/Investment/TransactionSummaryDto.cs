namespace Backend.DTOs.Investment
{
    public class TransactionSummaryDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string? Notes { get; set; }
    }
}
