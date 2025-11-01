using Backend.DTOs.Common;
using Backend.DTOs.User;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Backend.AppCode.AppConstants;

namespace Backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Get all users with pagination (Admin only)
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Page size (default: 10)</param>
        /// <param name="search">Search term for name/email</param>
        /// <returns>Paginated list of users</returns>
        [HttpGet]
        [Authorize(Roles = UserRole.Admin)]
        [ProducesResponseType(typeof(PagedResponse<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var users = await _userService.GetAllAsync(page, pageSize);
                var totalCount = await _userService.GetTotalCountAsync();

                // Apply search filter if provided
                var usersList = users.ToList();
                if (!string.IsNullOrWhiteSpace(search))
                {
                    usersList = usersList.Where(u =>
                        u.Email.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        u.FirstName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        u.LastName.Contains(search, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                _logger.LogInformation("Admin retrieved users list. Page: {Page}, PageSize: {PageSize}", page, pageSize);

                return Ok(PagedResponse<UserDto>.Create(usersList, page, pageSize, totalCount));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users list");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while retrieving users. Please try again later."));
            }
        }

        /// <summary>
        /// Get user by ID (Admin only or own profile)
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole(UserRole.Admin);

                // Users can only view their own profile unless they're admin
                if (!isAdmin && currentUserId != id)
                {
                    return Forbid();
                }

                var user = await _userService.GetByIdAsync(id);

                if (user == null)
                {
                    return NotFound(ApiResponse<UserDto>.ErrorResponse(
                        "User not found"));
                }

                _logger.LogInformation("User details retrieved: {UserId}", id);

                return Ok(ApiResponse<UserDto>.SuccessResponse(
                    user, "User retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user: {UserId}", id);
                return StatusCode(500, ApiResponse<UserDto>.ErrorResponse(
                    "An error occurred while retrieving user details. Please try again later."));
            }
        }

        /// <summary>
        /// Get current authenticated user's profile
        /// </summary>
        /// <returns>Current user details with role</returns>
        [HttpGet("profile")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<UserDto>.ErrorResponse(
                        "User not authenticated"));
                }

                var user = await _userService.GetByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(ApiResponse<UserDto>.ErrorResponse(
                        "User profile not found"));
                }

                _logger.LogInformation("User retrieved own profile: {UserId}", userId);

                return Ok(ApiResponse<UserDto>.SuccessResponse(
                    user, "Profile retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user profile");
                return StatusCode(500, ApiResponse<UserDto>.ErrorResponse(
                    "An error occurred while retrieving your profile. Please try again later."));
            }
        }

        /// <summary>
        /// Update user profile (Admin can update any user, users can update own profile)
        /// </summary>
        /// <param name="id">User ID</param>
        /// <param name="updateUserDto">Updated user information</param>
        /// <returns>Success message</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(ApiResponse.ErrorResponse(
                        "Validation failed", errors));
                }

                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole(UserRole.Admin);

                // Users can only update their own profile unless they're admin
                if (!isAdmin && currentUserId != id)
                {
                    return Forbid();
                }

                var result = await _userService.UpdateAsync(id, updateUserDto);

                if (!result)
                {
                    return NotFound(ApiResponse.ErrorResponse(
                        "User not found or update failed"));
                }

                _logger.LogInformation("User updated: {UserId} by {UpdatedBy}", id, currentUserId);

                return Ok(ApiResponse.SuccessResponse(
                    "User profile updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user: {UserId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while updating user. Please try again later."));
            }
        }

        /// <summary>
        /// Soft delete user account (Admin only)
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>Success message</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRole.Admin)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Prevent admin from deleting their own account
                if (currentUserId == id)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "You cannot delete your own account"));
                }

                var result = await _userService.DeleteAsync(id);

                if (!result)
                {
                    return NotFound(ApiResponse.ErrorResponse(
                        "User not found or already deleted"));
                }

                _logger.LogWarning("User deleted: {UserId} by Admin: {AdminId}", id, currentUserId);

                return Ok(ApiResponse.SuccessResponse(
                    "User account deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user: {UserId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while deleting user. Please try again later."));
            }
        }

        /// <summary>
        /// Toggle user active status (Activate/Deactivate) - Admin only
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>Success message with new status</returns>
        [HttpPatch("{id}/toggle-active")]
        [Authorize(Roles = UserRole.Admin)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ToggleActiveStatus(string id)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Prevent admin from deactivating their own account
                if (currentUserId == id)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "You cannot change your own account status"));
                }

                // Get user to check current status
                var user = await _userService.GetByIdAsync(id);
                if (user == null)
                {
                    return NotFound(ApiResponse.ErrorResponse(
                        "User not found"));
                }

                var result = await _userService.ToggleActiveStatusAsync(id);

                if (!result)
                {
                    return NotFound(ApiResponse.ErrorResponse(
                        "Failed to update user status"));
                }

                var newStatus = !user.IsActive ? "activated" : "deactivated";

                _logger.LogWarning("User status changed: {UserId} - {Status} by Admin: {AdminId}",
                    id, newStatus, currentUserId);

                return Ok(ApiResponse.SuccessResponse(
                    $"User account {newStatus} successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling user status: {UserId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while updating user status. Please try again later."));
            }
        }

        /// <summary>
        /// Get total user count (Admin only)
        /// </summary>
        /// <returns>Total number of users</returns>
        [HttpGet("stats/count")]
        [Authorize(Roles = UserRole.Admin)]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetUserCount()
        {
            try
            {
                var count = await _userService.GetTotalCountAsync();

                _logger.LogInformation("Total user count retrieved: {Count}", count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count, "User count retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user count");
                return StatusCode(500, ApiResponse<int>.ErrorResponse(
                    "An error occurred while retrieving user count. Please try again later."));
            }
        }
    }
}