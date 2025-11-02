namespace Backend.DTOs.Portfolio
{
    public class PortfolioSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int InvestmentCount { get; set; }
        public decimal TotalValue { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}