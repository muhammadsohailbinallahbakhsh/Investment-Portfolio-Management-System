using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static Backend.AppCode.AppConstants;

namespace Backend.Models
{
    public class Investment
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }           
        public string UserId { get; set; } = string.Empty; 
        public string Name { get; set; } = string.Empty;

        public InvestmentType Type { get; set; }        

        [Column(TypeName = "decimal(18,4)")]
        public decimal InitialAmount { get; set; }     

        [Column(TypeName = "decimal(18,4)")]
        public decimal CurrentValue { get; set; }

        
        [Column(TypeName = "decimal(18,8)")]
        public decimal? Quantity { get; set; }         

        [Column(TypeName = "decimal(18,8)")]
        public decimal? AveragePricePerUnit { get; set; }

        public DateTime PurchaseDate { get; set; }
        public string? BrokerPlatform { get; set; }
        public string? Notes { get; set; }

        public InvestmentStatus Status { get; set; } = InvestmentStatus.Active;

        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        [Timestamp]
        public byte[]? RowVersion { get; set; } 

        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Portfolio Portfolio { get; set; } = null!;
        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
