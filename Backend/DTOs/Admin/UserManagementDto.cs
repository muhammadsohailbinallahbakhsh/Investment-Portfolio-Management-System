namespace Backend.DTOs.Admin
{
    public class UserManagementDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public string Role { get; set; } = string.Empty;

        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool EmailConfirmed { get; set; }

        // Statistics
        public int PortfolioCount { get; set; }
        public int InvestmentCount { get; set; }
        public int TransactionCount { get; set; }
        public decimal TotalInvestmentValue { get; set; }
        public decimal TotalGainLoss { get; set; }

        // Dates
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }

        // Computed fields
        public string AccountStatus => IsDeleted ? "Deleted" : (IsActive ? "Active" : "Inactive");
        public int DaysSinceRegistration => (DateTime.UtcNow - CreatedAt).Days;
    }
}
