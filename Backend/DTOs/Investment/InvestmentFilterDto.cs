using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Investment
{
    public class InvestmentFilterDto
    {
        public string? SearchTerm { get; set; }
        public string? Type { get; set; }
        public string? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? MinGainLoss { get; set; }
        public decimal? MaxGainLoss { get; set; }
        public string? SortBy { get; set; } // Amount, CurrentValue, GainLoss, PurchaseDate
        public string? SortOrder { get; set; } = "desc"; // asc or desc
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}