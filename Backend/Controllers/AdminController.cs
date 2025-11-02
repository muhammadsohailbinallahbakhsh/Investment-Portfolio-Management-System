// Controllers/AdminController.cs
using Backend.DTOs.Admin;
using Backend.DTOs.Common;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Backend.AppCode.AppConstants;

namespace Backend.Controllers
{
    /// <summary>
    /// Admin Dashboard and User Management Controller
    /// All endpoints require Admin role
    /// </summary>
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = UserRole.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IActivityLogService _activityLogService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            IAdminService adminService,
            IActivityLogService activityLogService,
            ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _activityLogService = activityLogService;
            _logger = logger;
        }

        // ==========================================
        // DASHBOARD ENDPOINTS
        // ==========================================

        /// <summary>
        /// Get complete admin dashboard data (statistics + recent activity + recent users)
        /// This is the main endpoint for the admin dashboard page
        /// </summary>
        [HttpGet("dashboard")]
        [ProducesResponseType(typeof(ApiResponse<AdminDashboardDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var dashboardData = await _adminService.GetDashboardDataAsync();

                _logger.LogInformation("Admin {AdminId} accessed dashboard", adminId);

                return Ok(ApiResponse<AdminDashboardDto>.SuccessResponse(
                    dashboardData,
                    "Admin dashboard data retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving admin dashboard data");
                return StatusCode(500, ApiResponse<AdminDashboardDto>.ErrorResponse(
                    "An error occurred while retrieving dashboard data"));
            }
        }

        /// <summary>
        /// Get system-wide statistics for dashboard cards
        /// Returns: Total Users, Portfolios, Investments Value, Active Transactions Today
        /// </summary>
        [HttpGet("dashboard/stats")]
        [ProducesResponseType(typeof(ApiResponse<SystemStatistics>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSystemStatistics()
        {
            try
            {
                var statistics = await _adminService.GetSystemStatisticsAsync();

                _logger.LogInformation("Admin retrieved system statistics");

                return Ok(ApiResponse<SystemStatistics>.SuccessResponse(
                    statistics,
                    "System statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving system statistics");
                return StatusCode(500, ApiResponse<SystemStatistics>.ErrorResponse(
                    "An error occurred while retrieving system statistics"));
            }
        }

        /// <summary>
        /// Get recent system activities for dashboard activity log
        /// </summary>
        [HttpGet("dashboard/recent-activity")]
        [ProducesResponseType(typeof(ApiResponse<List<RecentActivityDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRecentActivity([FromQuery] int count = 20)
        {
            try
            {
                if (count < 1) count = 20;
                if (count > 100) count = 100;

                var activities = await _adminService.GetRecentActivitiesAsync(count);

                _logger.LogInformation("Admin retrieved {Count} recent activities", count);

                return Ok(ApiResponse<List<RecentActivityDto>>.SuccessResponse(
                    activities,
                    "Recent activities retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent activities");
                return StatusCode(500, ApiResponse<List<RecentActivityDto>>.ErrorResponse(
                    "An error occurred while retrieving recent activities"));
            }
        }

        /// <summary>
        /// Get recently registered users
        /// </summary>
        [HttpGet("dashboard/recent-users")]
        [ProducesResponseType(typeof(ApiResponse<List<UserSummaryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRecentUsers([FromQuery] int count = 10)
        {
            try
            {
                if (count < 1) count = 10;
                if (count > 50) count = 50;

                var users = await _adminService.GetRecentUsersAsync(count);

                _logger.LogInformation("Admin retrieved {Count} recent users", count);

                return Ok(ApiResponse<List<UserSummaryDto>>.SuccessResponse(
                    users,
                    "Recent users retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent users");
                return StatusCode(500, ApiResponse<List<UserSummaryDto>>.ErrorResponse(
                    "An error occurred while retrieving recent users"));
            }
        }

        // ==========================================
        // USER MANAGEMENT ENDPOINTS
        // ==========================================

        /// <summary>
        /// Search and filter users with pagination
        /// Supports: Search by name/email, Filter by role/status, Sort, Paginate
        /// </summary>
        [HttpGet("users")]
        [ProducesResponseType(typeof(PagedResponse<UserManagementDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchUsers([FromQuery] UserSearchDto searchDto)
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Validate pagination
                if (searchDto.Page < 1) searchDto.Page = 1;
                if (searchDto.PageSize < 1 || searchDto.PageSize > 100) searchDto.PageSize = 10;

                var (users, totalCount) = await _adminService.SearchUsersAsync(searchDto);

                _logger.LogInformation(
                    "Admin {AdminId} searched users. Page: {Page}, Search: {Search}, Role: {Role}",
                    adminId, searchDto.Page, searchDto.SearchTerm, searchDto.Role);

                return Ok(PagedResponse<UserManagementDto>.Create(
                    users, searchDto.Page, searchDto.PageSize, totalCount));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching users");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while searching users"));
            }
        }

        /// <summary>
        /// Get detailed user information by ID
        /// Includes: User details, portfolios, investments, transactions, recent activity
        /// </summary>
        [HttpGet("users/{userId}")]
        [ProducesResponseType(typeof(ApiResponse<UserDetailDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserDetail(string userId)
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var userDetail = await _adminService.GetUserDetailAsync(userId);

                if (userDetail == null)
                {
                    return NotFound(ApiResponse<UserDetailDto>.ErrorResponse(
                        "User not found"));
                }

                _logger.LogInformation("Admin {AdminId} viewed user detail {UserId}", adminId, userId);

                return Ok(ApiResponse<UserDetailDto>.SuccessResponse(
                    userDetail,
                    "User details retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user detail {UserId}", userId);
                return StatusCode(500, ApiResponse<UserDetailDto>.ErrorResponse(
                    "An error occurred while retrieving user details"));
            }
        }

        /// <summary>
        /// Get user statistics by user ID
        /// </summary>
        [HttpGet("users/{userId}/stats")]
        [ProducesResponseType(typeof(ApiResponse<UserStatistics>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserStatistics(string userId)
        {
            try
            {
                var statistics = await _adminService.GetUserStatisticsAsync(userId);

                _logger.LogInformation("Admin retrieved statistics for user {UserId}", userId);

                return Ok(ApiResponse<UserStatistics>.SuccessResponse(
                    statistics,
                    "User statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user statistics {UserId}", userId);
                return StatusCode(500, ApiResponse<UserStatistics>.ErrorResponse(
                    "An error occurred while retrieving user statistics"));
            }
        }

        /// <summary>
        /// Activate user account
        /// </summary>
        [HttpPatch("users/{userId}/activate")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ActivateUser(string userId)
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Prevent admin from deactivating themselves
                if (adminId == userId)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "You cannot change your own account status"));
                }

                var result = await _adminService.ActivateUserAsync(userId);

                if (!result)
                {
                    return NotFound(ApiResponse.ErrorResponse(
                        "User not found or already active"));
                }

                // Log activity
                await _activityLogService.LogActivityAsync(
                    adminId!,
                    ActivityAction.Update,
                    EntityType.User,
                    userId,
                    "Admin activated user account");

                _logger.LogInformation("Admin {AdminId} activated user {UserId}", adminId, userId);

                return Ok(ApiResponse.SuccessResponse(
                    "User account activated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error activating user {UserId}", userId);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while activating user account"));
            }
        }

        /// <summary>
        /// Deactivate user account
        /// </summary>
        [HttpPatch("users/{userId}/deactivate")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeactivateUser(string userId)
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Prevent admin from deactivating themselves
                if (adminId == userId)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "You cannot change your own account status"));
                }

                var result = await _adminService.DeactivateUserAsync(userId);

                if (!result)
                {
                    return NotFound(ApiResponse.ErrorResponse(
                        "User not found or already inactive"));
                }

                // Log activity
                await _activityLogService.LogActivityAsync(
                    adminId!,
                    ActivityAction.Update,
                    EntityType.User,
                    userId,
                    "Admin deactivated user account");

                _logger.LogWarning("Admin {AdminId} deactivated user {UserId}", adminId, userId);

                return Ok(ApiResponse.SuccessResponse(
                    "User account deactivated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating user {UserId}", userId);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while deactivating user account"));
            }
        }

        /// <summary>
        /// Soft delete user account
        /// CRITICAL: Cannot delete own account
        /// </summary>
        [HttpDelete("users/{userId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Prevent admin from deleting themselves
                if (adminId == userId)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "You cannot delete your own account"));
                }

                // Get user email for logging before deletion
                var userDetail = await _adminService.GetUserDetailAsync(userId);
                var userEmail = userDetail?.Email ?? "Unknown";

                var result = await _adminService.DeleteUserAsync(userId);

                if (!result)
                {
                    return NotFound(ApiResponse.ErrorResponse(
                        "User not found or already deleted"));
                }

                // Log activity
                await _activityLogService.LogActivityAsync(
                    adminId!,
                    ActivityAction.Delete,
                    EntityType.User,
                    userId,
                    $"Admin deleted user account: {userEmail}");

                _logger.LogWarning("Admin {AdminId} deleted user {UserId} ({Email})",
                    adminId, userId, userEmail);

                return Ok(ApiResponse.SuccessResponse(
                    "User account deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", userId);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while deleting user account"));
            }
        }

        /// <summary>
        /// Bulk activate users
        /// </summary>
        [HttpPost("users/bulk-activate")]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> BulkActivateUsers([FromBody] BulkUserActionDto bulkActionDto)
        {
            try
            {
                if (!ModelState.IsValid || bulkActionDto.UserIds.Count == 0)
                {
                    return BadRequest(ApiResponse.ErrorResponse("Invalid user IDs"));
                }

                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Remove admin's own ID if present
                bulkActionDto.UserIds.RemoveAll(id => id == adminId);

                var count = await _adminService.BulkActivateUsersAsync(bulkActionDto.UserIds);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    adminId!,
                    ActivityAction.Update,
                    EntityType.User,
                    null,
                    $"Admin bulk activated {count} user accounts");

                _logger.LogInformation("Admin {AdminId} bulk activated {Count} users", adminId, count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count,
                    $"{count} user account(s) activated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk activating users");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while activating user accounts"));
            }
        }

        /// <summary>
        /// Bulk deactivate users
        /// </summary>
        [HttpPost("users/bulk-deactivate")]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> BulkDeactivateUsers([FromBody] BulkUserActionDto bulkActionDto)
        {
            try
            {
                if (!ModelState.IsValid || bulkActionDto.UserIds.Count == 0)
                {
                    return BadRequest(ApiResponse.ErrorResponse("Invalid user IDs"));
                }

                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Remove admin's own ID if present
                bulkActionDto.UserIds.RemoveAll(id => id == adminId);

                var count = await _adminService.BulkDeactivateUsersAsync(bulkActionDto.UserIds);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    adminId!,
                    ActivityAction.Update,
                    EntityType.User,
                    null,
                    $"Admin bulk deactivated {count} user accounts");

                _logger.LogWarning("Admin {AdminId} bulk deactivated {Count} users", adminId, count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count,
                    $"{count} user account(s) deactivated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk deactivating users");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while deactivating user accounts"));
            }
        }

        /// <summary>
        /// Bulk delete users
        /// </summary>
        [HttpPost("users/bulk-delete")]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> BulkDeleteUsers([FromBody] BulkUserActionDto bulkActionDto)
        {
            try
            {
                if (!ModelState.IsValid || bulkActionDto.UserIds.Count == 0)
                {
                    return BadRequest(ApiResponse.ErrorResponse("Invalid user IDs"));
                }

                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Remove admin's own ID if present
                bulkActionDto.UserIds.RemoveAll(id => id == adminId);

                if (bulkActionDto.UserIds.Count == 0)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "Cannot perform bulk delete: No valid user IDs"));
                }

                var count = await _adminService.BulkDeleteUsersAsync(bulkActionDto.UserIds);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    adminId!,
                    ActivityAction.Delete,
                    EntityType.User,
                    null,
                    $"Admin bulk deleted {count} user accounts");

                _logger.LogWarning("Admin {AdminId} bulk deleted {Count} users", adminId, count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count,
                    $"{count} user account(s) deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk deleting users");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while deleting user accounts"));
            }
        }
    }
}