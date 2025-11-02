using Backend.DTOs.ActivityLog;
using Backend.DTOs.Common;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Backend.AppCode.AppConstants;

namespace Backend.Controllers
{
    [Route("api/activity-logs")]
    [ApiController]
    [Authorize]
    public class ActivityLogsController : ControllerBase
    {
        private readonly IActivityLogService _activityLogService;
        private readonly ILogger<ActivityLogsController> _logger;

        public ActivityLogsController(
            IActivityLogService activityLogService,
            ILogger<ActivityLogsController> logger)
        {
            _activityLogService = activityLogService;
            _logger = logger;
        }

        /// <summary>
        /// Get recent activity logs (Admin only - for dashboard)
        /// </summary>
        [HttpGet("recent")]
        [Authorize(Roles = UserRole.Admin)]
        [ProducesResponseType(typeof(ApiResponse<List<ActivityLogDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRecentActivityLogs([FromQuery] int count = 20)
        {
            try
            {
                if (count < 1) count = 20;
                if (count > 100) count = 100;

                var activityLogs = await _activityLogService.GetRecentAsync(count);

                var activityLogDtos = activityLogs.Select(log => new ActivityLogDto
                {
                    Id = log.Id,
                    UserId = log.UserId,
                    UserName = log.User != null ? $"{log.User.FirstName} {log.User.LastName}" : "Unknown",
                    UserEmail = log.User?.Email ?? "Unknown",
                    Action = log.Action.ToString(),
                    EntityType = log.EntityType.ToString(),
                    EntityId = log.EntityId,
                    Details = log.Details,
                    CreatedAt = log.CreatedAt
                }).ToList();

                _logger.LogInformation("Admin retrieved {Count} recent activity logs", count);

                return Ok(ApiResponse<List<ActivityLogDto>>.SuccessResponse(
                    activityLogDtos, "Recent activity logs retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent activity logs");
                return StatusCode(500, ApiResponse<List<ActivityLogDto>>.ErrorResponse(
                    "An error occurred while retrieving activity logs"));
            }
        }

        /// <summary>
        /// Get activity logs for current user
        /// </summary>
        [HttpGet("my-activity")]
        [ProducesResponseType(typeof(PagedResponse<ActivityLogDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyActivityLogs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 20;

                var activityLogs = await _activityLogService.GetByUserIdAsync(userId, page, pageSize);

                var activityLogDtos = activityLogs.Select(log => new ActivityLogDto
                {
                    Id = log.Id,
                    UserId = log.UserId,
                    UserName = log.User != null ? $"{log.User.FirstName} {log.User.LastName}" : "You",
                    UserEmail = log.User?.Email ?? string.Empty,
                    Action = log.Action.ToString(),
                    EntityType = log.EntityType.ToString(),
                    EntityId = log.EntityId,
                    Details = log.Details,
                    CreatedAt = log.CreatedAt
                }).ToList();

                // Get total count (we'll need to add this to repository)
                var totalCount = activityLogDtos.Count; // Simplified for now

                _logger.LogInformation("User {UserId} retrieved activity logs. Page: {Page}", userId, page);

                return Ok(PagedResponse<ActivityLogDto>.Create(
                    activityLogDtos, page, pageSize, totalCount));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user activity logs");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while retrieving your activity logs"));
            }
        }

        /// <summary>
        /// Get activity logs by user ID (Admin only)
        /// </summary>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = UserRole.Admin)]
        [ProducesResponseType(typeof(PagedResponse<ActivityLogDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserActivityLogs(
            string userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 20;

                var activityLogs = await _activityLogService.GetByUserIdAsync(userId, page, pageSize);

                var activityLogDtos = activityLogs.Select(log => new ActivityLogDto
                {
                    Id = log.Id,
                    UserId = log.UserId,
                    UserName = log.User != null ? $"{log.User.FirstName} {log.User.LastName}" : "Unknown",
                    UserEmail = log.User?.Email ?? "Unknown",
                    Action = log.Action.ToString(),
                    EntityType = log.EntityType.ToString(),
                    EntityId = log.EntityId,
                    Details = log.Details,
                    CreatedAt = log.CreatedAt
                }).ToList();

                var totalCount = activityLogDtos.Count;

                _logger.LogInformation("Admin retrieved activity logs for user {UserId}", userId);

                return Ok(PagedResponse<ActivityLogDto>.Create(
                    activityLogDtos, page, pageSize, totalCount));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user activity logs for {UserId}", userId);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while retrieving activity logs"));
            }
        }
    }
}