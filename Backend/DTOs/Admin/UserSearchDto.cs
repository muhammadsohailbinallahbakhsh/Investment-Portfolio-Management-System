namespace Backend.DTOs.Admin
{
    public class UserSearchDto
    {
        public string? SearchTerm { get; set; } // Search by name or email
        public bool? IsActive { get; set; } // Filter by active status
        public string? Role { get; set; } // Filter by role
        public DateTime? RegisteredAfter { get; set; }
        public DateTime? RegisteredBefore { get; set; }
        public string? SortBy { get; set; } = "CreatedAt"; // CreatedAt, Email, LastName, InvestmentValue
        public string? SortOrder { get; set; } = "desc"; // asc or desc
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
