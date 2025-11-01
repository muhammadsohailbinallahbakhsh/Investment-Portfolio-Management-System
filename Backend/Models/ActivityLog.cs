using static Backend.AppCode.AppConstants;

namespace Backend.Models
{
    public class ActivityLog
    {
        public int Id { get; set; }
        public string? UserId { get; set; } = string.Empty;
        public ActivityAction Action { get; set; }     
        public EntityType EntityType { get; set; }     
        public string? EntityId { get; set; }          
        public string? Details { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ApplicationUser? User { get; set; }
    }
}
