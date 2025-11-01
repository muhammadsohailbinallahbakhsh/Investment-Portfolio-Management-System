using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Portfolio
{
    public class UpdatePortfolioDto
    {
        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
