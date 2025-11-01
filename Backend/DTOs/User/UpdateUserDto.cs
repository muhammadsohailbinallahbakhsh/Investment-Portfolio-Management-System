using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.User
{
    public class UpdateUserDto
    {
        [Required]
        [MinLength(2)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        public string LastName { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }
    }
}
