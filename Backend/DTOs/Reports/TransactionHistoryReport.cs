namespace Backend.DTOs.Reports
{
    public class TransactionHistoryReport
    {
        public string ReportTitle { get; set; } = "Transaction History Report";
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public string PeriodStart { get; set; } = string.Empty;
        public string PeriodEnd { get; set; } = string.Empty;

        // Summary
        public int TotalTransactions { get; set; }
        public decimal TotalVolume { get; set; }
        public int BuyTransactions { get; set; }
        public decimal BuyVolume { get; set; }
        public int SellTransactions { get; set; }
        public decimal SellVolume { get; set; }
        public int UpdateTransactions { get; set; }

        // Transactions by Type
        public List<TransactionsByTypeItem> TransactionsByType { get; set; } = new();

        // Transactions by Month
        public List<TransactionsByMonthItem> TransactionsByMonth { get; set; } = new();

        // Detailed Transactions
        public List<TransactionDetailItem> Transactions { get; set; } = new();
    }
}
