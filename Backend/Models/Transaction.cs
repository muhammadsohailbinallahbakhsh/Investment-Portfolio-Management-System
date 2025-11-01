using System.ComponentModel.DataAnnotations.Schema;
using static Backend.AppCode.AppConstants;

namespace Backend.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public int InvestmentId { get; set; }
        public TransactionType Type { get; set; } = TransactionType.Buy;
        [Column(TypeName = "decimal(18,8)")]
        public decimal Quantity { get; set; } = 0m;

        [Column(TypeName = "decimal(18,8)")]
        public decimal PricePerUnit { get; set; } = 0m; 
        [Column(TypeName = "decimal(18,4)")]
        public decimal Amount { get; set; } = 0m;
        public DateTime TransactionDate { get; set; }
        public string? Notes { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public virtual Investment Investment { get; set; } = null!;
    }
}
