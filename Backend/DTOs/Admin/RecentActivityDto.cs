namespace Backend.DTOs.Admin
{
    /// <summary>
    /// Recent activity log entry for dashboard
    /// </summary>
    public class RecentActivityDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public string? EntityId { get; set; }
        public string? Details { get; set; }
        public DateTime CreatedAt { get; set; }
        public string TimeAgo { get; set; } = string.Empty; // "2 minutes ago", "1 hour ago"
    }
}
