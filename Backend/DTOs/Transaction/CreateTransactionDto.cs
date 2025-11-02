using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Transaction
{
    public class CreateTransactionDto
    {
        [Required]
        public int InvestmentId { get; set; }

        [Required]
        public string Type { get; set; } = string.Empty; // Buy, Sell, Update

        [Required]
        [Range(0.00000001, double.MaxValue, ErrorMessage = "Quantity must be greater than zero")]
        public decimal Quantity { get; set; }

        [Required]
        [Range(0.00000001, double.MaxValue, ErrorMessage = "Price per unit must be greater than zero")]
        public decimal PricePerUnit { get; set; }

        // Amount is computed: Quantity * PricePerUnit (backend calculates)
        public string? Notes { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }
    }
}
