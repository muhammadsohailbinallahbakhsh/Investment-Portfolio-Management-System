namespace Backend.DTOs.Dashboard
{
    public class RecentTransactionDto
    {
        public int Id { get; set; }
        public int InvestmentId { get; set; }
        public string InvestmentName { get; set; } = string.Empty;
        public string InvestmentType { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public DateTime TransactionDate { get; set; }
        public string? Notes { get; set; }
        public string TimeAgo { get; set; } = string.Empty;
    }
}
