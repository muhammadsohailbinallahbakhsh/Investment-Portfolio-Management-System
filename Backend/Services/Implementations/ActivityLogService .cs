using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using static Backend.AppCode.AppConstants;

namespace Backend.Services.Implementations
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly ILogger<ActivityLogService> _logger;

        public ActivityLogService(
            IActivityLogRepository activityLogRepository,
            ILogger<ActivityLogService> logger)
        {
            _activityLogRepository = activityLogRepository;
            _logger = logger;
        }

        public async Task LogActivityAsync(
            string userId,
            ActivityAction action,
            EntityType entityType,
            string? entityId = null,
            string? details = null)
        {
            try
            {
                var activityLog = new ActivityLog
                {
                    UserId = userId,
                    Action = action,
                    EntityType = entityType,
                    EntityId = entityId,
                    Details = details,
                    CreatedAt = DateTime.UtcNow
                };

                await _activityLogRepository.CreateAsync(activityLog);

                _logger.LogInformation(
                    "Activity logged: User {UserId} performed {Action} on {EntityType} {EntityId}",
                    userId, action, entityType, entityId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log activity for user {UserId}", userId);
                // Purposely Didn't throw - activity logging shouldn't break the main operation
            }
        }

        public async Task<IEnumerable<ActivityLog>> GetRecentAsync(int count)
        {
            return await _activityLogRepository.GetRecentAsync(count);
        }

        public async Task<IEnumerable<ActivityLog>> GetByUserIdAsync(string userId, int page, int pageSize)
        {
            return await _activityLogRepository.GetByUserIdAsync(userId, page, pageSize);
        }
    }
}