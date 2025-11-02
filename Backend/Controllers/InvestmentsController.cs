using Backend.DTOs.Common;
using Backend.DTOs.Investment;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Backend.AppCode.AppConstants;

namespace Backend.Controllers
{
    [Route("api/investments")]
    [ApiController]
    [Authorize]
    public class InvestmentsController : ControllerBase
    {
        private readonly IInvestmentService _investmentService;
        private readonly IActivityLogService _activityLogService;
        private readonly ILogger<InvestmentsController> _logger;

        public InvestmentsController(
            IInvestmentService investmentService,
            IActivityLogService activityLogService,
            ILogger<InvestmentsController> logger)
        {
            _investmentService = investmentService;
            _activityLogService = activityLogService;
            _logger = logger;
        }

        /// <summary>
        /// Get investments with filtering, sorting, and pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResponse<InvestmentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetInvestments([FromQuery] InvestmentFilterDto filterDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole(UserRole.Admin);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // Validate pagination
                if (filterDto.Page < 1) filterDto.Page = 1;
                if (filterDto.PageSize < 1 || filterDto.PageSize > 100) filterDto.PageSize = 10;

                var (investments, totalCount) = await _investmentService
                    .GetFilteredInvestmentsAsync(userId, filterDto, isAdmin);

                _logger.LogInformation(
                    "User {UserId} retrieved investments. Page: {Page}, Filters applied",
                    userId, filterDto.Page);

                return Ok(PagedResponse<InvestmentDto>.Create(
                    investments, filterDto.Page, filterDto.PageSize, totalCount));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving investments");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while retrieving investments"));
            }
        }

        /// <summary>
        /// Get investment by ID with basic details
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<InvestmentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetInvestment(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var investment = await _investmentService.GetByIdAsync(id);

                if (investment == null || investment.UserId != userId)
                    return NotFound(ApiResponse<InvestmentDto>.ErrorResponse("Investment not found"));

                _logger.LogInformation("User {UserId} retrieved investment {InvestmentId}", userId, id);

                return Ok(ApiResponse<InvestmentDto>.SuccessResponse(
                    investment, "Investment retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving investment {InvestmentId}", id);
                return StatusCode(500, ApiResponse<InvestmentDto>.ErrorResponse(
                    "An error occurred while retrieving investment"));
            }
        }

        /// <summary>
        /// Get investment detail with transactions and performance data
        /// </summary>
        [HttpGet("{id}/detail")]
        [ProducesResponseType(typeof(ApiResponse<InvestmentDetailDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetInvestmentDetail(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var investment = await _investmentService.GetDetailByIdAsync(id, userId);

                if (investment == null)
                    return NotFound(ApiResponse<InvestmentDetailDto>.ErrorResponse(
                        "Investment not found or access denied"));

                _logger.LogInformation("User {UserId} retrieved investment detail {InvestmentId}", userId, id);

                return Ok(ApiResponse<InvestmentDetailDto>.SuccessResponse(
                    investment, "Investment details retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving investment detail {InvestmentId}", id);
                return StatusCode(500, ApiResponse<InvestmentDetailDto>.ErrorResponse(
                    "An error occurred while retrieving investment details"));
            }
        }

        /// <summary>
        /// Create new investment
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<InvestmentDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateInvestment([FromBody] CreateInvestmentDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    return BadRequest(ApiResponse<InvestmentDto>.ErrorResponse("Validation failed", errors));
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // Validate purchase date is not in future
                if (createDto.PurchaseDate > DateTime.UtcNow)
                    return BadRequest(ApiResponse<InvestmentDto>.ErrorResponse(
                        "Purchase date cannot be in the future"));

                var investment = await _investmentService.CreateAsync(userId, createDto);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Create,
                    EntityType.Investment,
                    investment.Id.ToString(),
                    $"Created investment: {investment.Name}");

                _logger.LogInformation(
                    "User {UserId} created investment {InvestmentId}: {InvestmentName}",
                    userId, investment.Id, investment.Name);

                return CreatedAtAction(
                    nameof(GetInvestment),
                    new { id = investment.Id },
                    ApiResponse<InvestmentDto>.SuccessResponse(
                        investment, "Investment created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating investment");
                return StatusCode(500, ApiResponse<InvestmentDto>.ErrorResponse(
                    "An error occurred while creating investment"));
            }
        }

        /// <summary>
        /// Update existing investment
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateInvestment(int id, [FromBody] UpdateInvestmentDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // Validate purchase date
                if (updateDto.PurchaseDate > DateTime.UtcNow)
                    return BadRequest(ApiResponse.ErrorResponse(
                        "Purchase date cannot be in the future"));

                var result = await _investmentService.UpdateAsync(id, userId, updateDto);

                if (!result)
                    return NotFound(ApiResponse.ErrorResponse(
                        "Investment not found or access denied"));

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Update,
                    EntityType.Investment,
                    id.ToString(),
                    $"Updated investment: {updateDto.Name}");

                _logger.LogInformation("User {UserId} updated investment {InvestmentId}", userId, id);

                return Ok(ApiResponse.SuccessResponse("Investment updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating investment {InvestmentId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while updating investment"));
            }
        }

        /// <summary>
        /// Delete investment (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteInvestment(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // Get investment name for logging before deletion
                var investment = await _investmentService.GetByIdAsync(id);
                var investmentName = investment?.Name ?? "Unknown";

                var result = await _investmentService.DeleteAsync(id, userId);

                if (!result)
                    return NotFound(ApiResponse.ErrorResponse(
                        "Investment not found or access denied"));

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Delete,
                    EntityType.Investment,
                    id.ToString(),
                    $"Deleted investment: {investmentName}");

                _logger.LogWarning("User {UserId} deleted investment {InvestmentId}", userId, id);

                return Ok(ApiResponse.SuccessResponse("Investment deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting investment {InvestmentId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while deleting investment"));
            }
        }

        /// <summary>
        /// Bulk delete investments
        /// </summary>
        [HttpPost("bulk-delete")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> BulkDeleteInvestments([FromBody] BulkDeleteDto bulkDeleteDto)
        {
            try
            {
                if (!ModelState.IsValid || bulkDeleteDto.InvestmentIds.Count == 0)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid investment IDs"));

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole(UserRole.Admin);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var result = await _investmentService.BulkDeleteAsync(
                    bulkDeleteDto.InvestmentIds, userId, isAdmin);

                if (!result)
                    return BadRequest(ApiResponse.ErrorResponse(
                        "No investments were deleted. Check IDs and permissions."));

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Delete,
                    EntityType.Investment,
                    null,
                    $"Bulk deleted {bulkDeleteDto.InvestmentIds.Count} investments");

                _logger.LogWarning(
                    "User {UserId} bulk deleted investments: {Count}",
                    userId, bulkDeleteDto.InvestmentIds.Count);

                return Ok(ApiResponse.SuccessResponse(
                    $"Selected investments deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk deleting investments");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while deleting investments"));
            }
        }

        /// <summary>
        /// Get user investment statistics
        /// </summary>
        [HttpGet("stats")]
        [ProducesResponseType(typeof(ApiResponse<InvestmentStatsDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetInvestmentStats()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var stats = await _investmentService.GetUserStatsAsync(userId);

                _logger.LogInformation("User {UserId} retrieved investment statistics", userId);

                return Ok(ApiResponse<InvestmentStatsDto>.SuccessResponse(
                    stats, "Investment statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving investment statistics");
                return StatusCode(500, ApiResponse<InvestmentStatsDto>.ErrorResponse(
                    "An error occurred while retrieving statistics"));
            }
        }

        /// <summary>
        /// Export single investment to CSV
        /// </summary>
        [HttpGet("{id}/export")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ExportInvestment(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var investment = await _investmentService.GetByIdAsync(id);
                if (investment == null || investment.UserId != userId)
                    return NotFound(ApiResponse.ErrorResponse("Investment not found"));

                var csvData = await _investmentService.ExportInvestmentToCsvAsync(id, userId);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Export,
                    EntityType.Investment,
                    id.ToString(),
                    $"Exported investment: {investment.Name}");

                _logger.LogInformation(
                    "User {UserId} exported investment {InvestmentId}", userId, id);

                var fileName = $"Investment_{investment.Name}_{DateTime.UtcNow:yyyyMMdd}.csv";
                return File(csvData, "text/csv", fileName);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting investment {InvestmentId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while exporting investment"));
            }
        }

        /// <summary>
        /// Export multiple investments to CSV
        /// </summary>
        [HttpPost("export")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ExportInvestments([FromBody] BulkDeleteDto exportDto)
        {
            try
            {
                if (!ModelState.IsValid || exportDto.InvestmentIds.Count == 0)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid investment IDs"));

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var csvData = await _investmentService.ExportAllToCsvAsync(
                    exportDto.InvestmentIds, userId);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Export,
                    EntityType.Investment,
                    null,
                    $"Exported {exportDto.InvestmentIds.Count} investments");

                _logger.LogInformation(
                    "User {UserId} exported {Count} investments",
                    userId, exportDto.InvestmentIds.Count);

                var fileName = $"Investments_Export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
                return File(csvData, "text/csv", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting investments");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while exporting investments"));
            }
        }
    }
}