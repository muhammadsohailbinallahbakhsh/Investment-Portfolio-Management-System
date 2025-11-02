using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Admin
{
    public class BulkUserActionDto
    {
        [Required]
        public List<string> UserIds { get; set; } = new();

        [Required]
        public string Action { get; set; } = string.Empty; // "activate", "deactivate", "delete"
    }
}
