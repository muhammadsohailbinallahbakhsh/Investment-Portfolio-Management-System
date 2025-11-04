namespace Backend.Models
{
    public class Portfolio
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = "Default Portfolio";
        public string? Description { get; set; }
        public bool IsDefault { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ICollection<Investment> Investments { get; set; } = new List<Investment>();
    }

}
