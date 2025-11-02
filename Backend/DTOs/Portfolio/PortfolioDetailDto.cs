namespace Backend.DTOs.Portfolio
{
    public class PortfolioDetailDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Financial Summary
        public decimal TotalInvested { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal TotalGainLossPercentage { get; set; }
        public int TotalInvestments { get; set; }
        public int ActiveInvestments { get; set; }

        // Breakdown by Type
        public Dictionary<string, decimal> ValueByType { get; set; } = new();
        public Dictionary<string, int> CountByType { get; set; } = new();

        // Breakdown by Status
        public Dictionary<string, int> CountByStatus { get; set; } = new();

        // Investment List (summary)
        public List<PortfolioInvestmentSummary> Investments { get; set; } = new();

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
