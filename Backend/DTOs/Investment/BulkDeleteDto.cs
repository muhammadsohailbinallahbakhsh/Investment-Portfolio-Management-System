using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Investment
{
    public class BulkDeleteDto
    {
        [Required]
        public List<int> InvestmentIds { get; set; } = new();
    }
}