namespace Backend.DTOs.Dashboard
{
    public class MonthlyPerformanceSummary
    {
        public string Month { get; set; } = string.Empty; // "Jan 2024"
        public decimal StartValue { get; set; }
        public decimal EndValue { get; set; }
        public decimal GainLoss { get; set; }
        public decimal GainLossPercentage { get; set; }
        public int TransactionCount { get; set; }
    }
}
