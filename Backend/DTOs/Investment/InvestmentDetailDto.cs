namespace Backend.DTOs.Investment
{
    public class InvestmentDetailDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int? PortfolioId { get; set; }
        public string? PortfolioName { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal InitialAmount { get; set; }
        public decimal CurrentValue { get; set; }

        public decimal? Quantity { get; set; }
        public decimal? AveragePricePerUnit { get; set; }

        public decimal GainLoss => CurrentValue - InitialAmount;
        public decimal GainLossPercentage => InitialAmount > 0
            ? Math.Round(((CurrentValue - InitialAmount) / InitialAmount) * 100, 2)
            : 0;

        public DateTime PurchaseDate { get; set; }
        public string? BrokerPlatform { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Performance data for charts (value progression)
        public List<PerformancePoint> PerformanceHistory { get; set; } = new();

        // Transaction history
        public List<TransactionSummaryDto> Transactions { get; set; } = new();
    }
}