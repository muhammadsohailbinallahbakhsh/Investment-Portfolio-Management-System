using Backend.Models;
using static Backend.AppCode.AppConstants;

namespace Backend.Services.Interfaces
{
    public interface IActivityLogService
    {
        Task LogActivityAsync(string userId, ActivityAction action, EntityType entityType, string? entityId = null, string? details = null);
        Task<IEnumerable<ActivityLog>> GetRecentAsync(int count);
        Task<IEnumerable<ActivityLog>> GetByUserIdAsync(string userId, int page, int pageSize);
    }
}
