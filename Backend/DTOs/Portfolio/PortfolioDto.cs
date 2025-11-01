namespace Backend.DTOs.Portfolio
{
    public class PortfolioDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public decimal TotalInvested { get; set; }
        public decimal CurrentValue { get; set; }
        public int TotalInvestments { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
