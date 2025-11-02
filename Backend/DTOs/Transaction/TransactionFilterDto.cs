using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Transaction
{
    public class TransactionFilterDto
    {
        public int? InvestmentId { get; set; }
        public string? Type { get; set; } // Buy, Sell, Update
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? SearchTerm { get; set; } // Search by investment name
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "TransactionDate"; // TransactionDate, Amount
        public string? SortOrder { get; set; } = "desc"; // asc or desc
    }
}