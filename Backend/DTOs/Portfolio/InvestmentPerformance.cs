namespace Backend.DTOs.Portfolio
{
    public class InvestmentPerformance
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal CurrentValue { get; set; }
        public decimal GainLossPercentage { get; set; }
    }
}
