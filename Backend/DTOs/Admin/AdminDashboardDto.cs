namespace Backend.DTOs.Admin
{
    public class AdminDashboardDto
    {
        public SystemStatistics Statistics { get; set; } = new();
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
        public List<UserSummaryDto> RecentUsers { get; set; } = new();
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
