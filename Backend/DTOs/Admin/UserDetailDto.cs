namespace Backend.DTOs.Admin
{
    public class UserDetailDto
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

        // Account information
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }

        // Portfolio summary
        public List<PortfolioSummary> Portfolios { get; set; } = new();

        // Investment summary
        public int TotalInvestments { get; set; }
        public decimal TotalInvested { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal GainLossPercentage { get; set; }

        // Transaction summary
        public int TotalTransactions { get; set; }
        public DateTime? LastTransactionDate { get; set; }

        // Recent activity
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
    }
}
