using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Transaction
{
    public class TransactionPreviewDto
    {
        [Required]
        public int InvestmentId { get; set; }

        [Required]
        public string Type { get; set; } = string.Empty; // Buy, Sell, Update

        [Required]
        [Range(0.00000001, double.MaxValue)]
        public decimal Quantity { get; set; }

        [Required]
        [Range(0.00000001, double.MaxValue)]
        public decimal PricePerUnit { get; set; }
    }
}