namespace Backend.DTOs.Reports
{
    public class MonthPerformanceItem
    {
        public string Month { get; set; } = string.Empty;
        public decimal StartValue { get; set; }
        public decimal EndValue { get; set; }
        public decimal Growth { get; set; }
        public decimal GrowthPercentage { get; set; }
        public int TransactionCount { get; set; }
        public decimal TransactionVolume { get; set; }
    }
}
