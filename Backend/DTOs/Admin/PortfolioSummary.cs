namespace Backend.DTOs.Admin
{
    public class PortfolioSummary
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int InvestmentCount { get; set; }
        public decimal TotalValue { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
