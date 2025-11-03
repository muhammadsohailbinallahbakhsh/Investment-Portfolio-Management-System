using Backend.DTOs.Investment;

public class InvestmentStatsDto
{
    public int TotalInvestments { get; set; }
    public decimal TotalInvested { get; set; }
    public decimal CurrentValue { get; set; }
    public decimal TotalGainLoss { get; set; }
    public decimal TotalGainLossPercentage { get; set; }

    public InvestmentSummary? BestPerforming { get; set; }
    public InvestmentSummary? WorstPerforming { get; set; }

    public Dictionary<string, int> InvestmentsByType { get; set; } = new();
    public Dictionary<string, decimal> ValueByType { get; set; } = new();
}