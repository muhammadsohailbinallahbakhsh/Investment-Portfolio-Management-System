using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Investment
{
    public class UpdateInvestmentDto
    {
        [Required]
        [MinLength(3)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal InitialAmount { get; set; }

        [Range(0.0, double.MaxValue)]
        public decimal? Quantity { get; set; }

        [Range(0.0, double.MaxValue)]
        public decimal? AveragePricePerUnit { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        public string? BrokerPlatform { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
