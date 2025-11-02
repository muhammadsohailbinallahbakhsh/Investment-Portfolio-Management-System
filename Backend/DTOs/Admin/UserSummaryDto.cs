namespace Backend.DTOs.Admin
{
    public class UserSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int PortfolioCount { get; set; }
        public int InvestmentCount { get; set; }
        public decimal TotalInvestmentValue { get; set; }
        public DateTime CreatedAt { get; set; }
        public string MemberSince { get; set; } = string.Empty; // "2 days ago"
    }
}
