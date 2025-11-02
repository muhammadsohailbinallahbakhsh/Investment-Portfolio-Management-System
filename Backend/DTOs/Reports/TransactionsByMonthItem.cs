namespace Backend.DTOs.Reports
{
    public class TransactionsByMonthItem
    {
        public string Month { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Volume { get; set; }
    }
}
