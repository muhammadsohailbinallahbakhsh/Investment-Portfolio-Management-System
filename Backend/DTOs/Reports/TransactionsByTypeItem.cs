namespace Backend.DTOs.Reports
{
    public class TransactionsByTypeItem
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Volume { get; set; }
        public decimal Percentage { get; set; }
    }
}
