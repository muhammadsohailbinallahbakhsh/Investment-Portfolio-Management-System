namespace Backend.DTOs.Transaction
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public int InvestmentId { get; set; }
        public string InvestmentName { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal Amount { get; set; }

        public DateTime TransactionDate { get; set; }
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
