namespace Backend.DTOs.Reports
{
    public class YearSummaryItem
    {
        public int Year { get; set; }
        public decimal StartingValue { get; set; }
        public decimal EndingValue { get; set; }
        public decimal TotalInvested { get; set; }
        public decimal Growth { get; set; }
        public decimal GrowthPercentage { get; set; }
        public int TotalTransactions { get; set; }
        public decimal TransactionVolume { get; set; }
        public int NewInvestments { get; set; }
    }
}
