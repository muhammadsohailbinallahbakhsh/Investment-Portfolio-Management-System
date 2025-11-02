public class InvestmentSummary
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal GainLossPercentage { get; set; }
    public decimal CurrentValue { get; set; }
}