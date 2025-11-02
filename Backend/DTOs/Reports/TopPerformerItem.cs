namespace Backend.DTOs.Reports
{
    public class TopPerformerItem
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal InitialAmount { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal GainLoss { get; set; }
        public decimal GainLossPercentage { get; set; }
    }

}
