using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Investment
{
    public class CreateInvestmentDto
    {
        [Required]
        public int PortfolioId { get; set; } // required — links investment to a portfolio

        [Required]
        [MinLength(3)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty; // Stocks, Bonds, Crypto, etc.

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal InitialAmount { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        [Range(0.0, double.MaxValue)]
        public decimal? Quantity { get; set; } // optional for assets like stocks/crypto

        [Range(0.0, double.MaxValue)]
        public decimal? AveragePricePerUnit { get; set; }

        public string? BrokerPlatform { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        [Required]
        public string Status { get; set; } = "Active";
    }
}
