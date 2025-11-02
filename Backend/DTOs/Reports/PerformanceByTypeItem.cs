namespace Backend.DTOs.Reports
{
    public class PerformanceByTypeItem
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal TotalInvested { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal GainLoss { get; set; }
        public decimal GainLossPercentage { get; set; }
    }
}
