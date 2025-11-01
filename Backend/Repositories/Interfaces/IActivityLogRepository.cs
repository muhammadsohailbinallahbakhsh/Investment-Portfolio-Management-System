using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IActivityLogRepository
    {
        Task<IEnumerable<ActivityLog>> GetRecentAsync(int count);
        Task<IEnumerable<ActivityLog>> GetByUserIdAsync(string userId, int page, int pageSize);
        Task CreateAsync(ActivityLog activityLog);
    }
}
