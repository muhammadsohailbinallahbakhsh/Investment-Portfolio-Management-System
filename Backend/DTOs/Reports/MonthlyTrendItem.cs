namespace Backend.DTOs.Reports
{
    public class MonthlyTrendItem
    {
        public string Month { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public decimal InvestedAmount { get; set; }
        public decimal GainLoss { get; set; }
        public decimal GainLossPercentage { get; set; }
    }
}
