using Backend.DTOs.Common;
using Backend.DTOs.Portfolio;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Backend.AppCode.AppConstants;

namespace Backend.Controllers
{
    [Route("api/portfolios")]
    [ApiController]
    [Authorize]
    public class PortfoliosController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;
        private readonly IActivityLogService _activityLogService;
        private readonly ILogger<PortfoliosController> _logger;

        public PortfoliosController(
            IPortfolioService portfolioService,
            IActivityLogService activityLogService,
            ILogger<PortfoliosController> logger)
        {
            _portfolioService = portfolioService;
            _activityLogService = activityLogService;
            _logger = logger;
        }

        /// <summary>
        /// Get all portfolios for current user
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<PortfolioDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserPortfolios()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var portfolios = await _portfolioService.GetByUserIdAsync(userId);

                _logger.LogInformation("User {UserId} retrieved their portfolios", userId);

                return Ok(ApiResponse<List<PortfolioDto>>.SuccessResponse(
                    portfolios.ToList(), "Portfolios retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user portfolios");
                return StatusCode(500, ApiResponse<List<PortfolioDto>>.ErrorResponse(
                    "An error occurred while retrieving portfolios"));
            }
        }

        /// <summary>
        /// Get portfolios in summary format (for dropdowns/cards)
        /// </summary>
        [HttpGet("summaries")]
        [ProducesResponseType(typeof(ApiResponse<List<PortfolioSummaryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPortfolioSummaries()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var summaries = await _portfolioService.GetUserPortfolioSummariesAsync(userId);

                _logger.LogInformation("User {UserId} retrieved portfolio summaries", userId);

                return Ok(ApiResponse<List<PortfolioSummaryDto>>.SuccessResponse(
                    summaries, "Portfolio summaries retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio summaries");
                return StatusCode(500, ApiResponse<List<PortfolioSummaryDto>>.ErrorResponse(
                    "An error occurred while retrieving portfolio summaries"));
            }
        }

        /// <summary>
        /// Get portfolio by ID (basic info)
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<PortfolioDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPortfolio(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var portfolio = await _portfolioService.GetByIdAsync(id);

                if (portfolio == null || portfolio.UserId != userId)
                    return NotFound(ApiResponse<PortfolioDto>.ErrorResponse(
                        "Portfolio not found or access denied"));

                _logger.LogInformation("User {UserId} retrieved portfolio {PortfolioId}", userId, id);

                return Ok(ApiResponse<PortfolioDto>.SuccessResponse(
                    portfolio, "Portfolio retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio {PortfolioId}", id);
                return StatusCode(500, ApiResponse<PortfolioDto>.ErrorResponse(
                    "An error occurred while retrieving portfolio"));
            }
        }

        /// <summary>
        /// Get portfolio detail with investments and breakdown
        /// </summary>
        [HttpGet("{id}/detail")]
        [ProducesResponseType(typeof(ApiResponse<PortfolioDetailDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPortfolioDetail(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var portfolio = await _portfolioService.GetDetailByIdAsync(id, userId);

                if (portfolio == null)
                    return NotFound(ApiResponse<PortfolioDetailDto>.ErrorResponse(
                        "Portfolio not found or access denied"));

                _logger.LogInformation("User {UserId} retrieved portfolio detail {PortfolioId}", userId, id);

                return Ok(ApiResponse<PortfolioDetailDto>.SuccessResponse(
                    portfolio, "Portfolio details retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio detail {PortfolioId}", id);
                return StatusCode(500, ApiResponse<PortfolioDetailDto>.ErrorResponse(
                    "An error occurred while retrieving portfolio details"));
            }
        }

        /// <summary>
        /// Get portfolio statistics (for dashboard/charts)
        /// </summary>
        [HttpGet("{id}/stats")]
        [ProducesResponseType(typeof(ApiResponse<PortfolioStatsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPortfolioStats(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var stats = await _portfolioService.GetPortfolioStatsAsync(id, userId);

                if (stats == null)
                    return NotFound(ApiResponse<PortfolioStatsDto>.ErrorResponse(
                        "Portfolio not found or access denied"));

                _logger.LogInformation("User {UserId} retrieved portfolio stats {PortfolioId}", userId, id);

                return Ok(ApiResponse<PortfolioStatsDto>.SuccessResponse(
                    stats, "Portfolio statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio stats {PortfolioId}", id);
                return StatusCode(500, ApiResponse<PortfolioStatsDto>.ErrorResponse(
                    "An error occurred while retrieving portfolio statistics"));
            }
        }

        /// <summary>
        /// Create new portfolio
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<PortfolioDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreatePortfolio([FromBody] CreatePortfolioDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    return BadRequest(ApiResponse<PortfolioDto>.ErrorResponse(
                        "Validation failed", errors));
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var portfolio = await _portfolioService.CreateAsync(userId, createDto);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Create,
                    EntityType.Portfolio,
                    portfolio.Id.ToString(),
                    $"Created portfolio: {portfolio.Name}");

                _logger.LogInformation(
                    "User {UserId} created portfolio {PortfolioId}: {PortfolioName}",
                    userId, portfolio.Id, portfolio.Name);

                return CreatedAtAction(
                    nameof(GetPortfolio),
                    new { id = portfolio.Id },
                    ApiResponse<PortfolioDto>.SuccessResponse(
                        portfolio, "Portfolio created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating portfolio");
                return StatusCode(500, ApiResponse<PortfolioDto>.ErrorResponse(
                    "An error occurred while creating portfolio"));
            }
        }

        /// <summary>
        /// Update portfolio
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePortfolio(int id, [FromBody] UpdatePortfolioDto updateDto)
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

                var result = await _portfolioService.UpdateAsync(id, userId, updateDto);

                if (!result)
                    return NotFound(ApiResponse.ErrorResponse(
                        "Portfolio not found or access denied"));

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Update,
                    EntityType.Portfolio,
                    id.ToString(),
                    $"Updated portfolio: {updateDto.Name}");

                _logger.LogInformation("User {UserId} updated portfolio {PortfolioId}", userId, id);

                return Ok(ApiResponse.SuccessResponse("Portfolio updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating portfolio {PortfolioId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while updating portfolio"));
            }
        }

        /// <summary>
        /// Delete portfolio (soft delete)
        /// CRITICAL: Portfolio can only be deleted if it has NO investments
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePortfolio(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // ✅ CRITICAL: Check if portfolio can be deleted (no investments)
                var canDelete = await _portfolioService.CanDeleteAsync(id, userId);

                if (!canDelete)
                {
                    var investmentCount = await _portfolioService.GetInvestmentCountAsync(id);

                    if (investmentCount > 0)
                    {
                        return BadRequest(ApiResponse.ErrorResponse(
                            $"Cannot delete portfolio. It contains {investmentCount} investment(s). " +
                            "Please move or delete all investments before deleting the portfolio."));
                    }
                    else
                    {
                        return NotFound(ApiResponse.ErrorResponse(
                            "Portfolio not found or access denied"));
                    }
                }

                // Get portfolio name for logging before deletion
                var portfolio = await _portfolioService.GetByIdAsync(id);
                var portfolioName = portfolio?.Name ?? "Unknown";

                var result = await _portfolioService.DeleteAsync(id, userId);

                if (!result)
                    return NotFound(ApiResponse.ErrorResponse(
                        "Portfolio not found or access denied"));

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Delete,
                    EntityType.Portfolio,
                    id.ToString(),
                    $"Deleted portfolio: {portfolioName}");

                _logger.LogWarning("User {UserId} deleted portfolio {PortfolioId}", userId, id);

                return Ok(ApiResponse.SuccessResponse("Portfolio deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting portfolio {PortfolioId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while deleting portfolio"));
            }
        }

        /// <summary>
        /// Check if portfolio can be deleted (has no investments)
        /// Useful for frontend validation before showing delete button
        /// </summary>
        [HttpGet("{id}/can-delete")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> CanDeletePortfolio(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var canDelete = await _portfolioService.CanDeleteAsync(id, userId);
                var investmentCount = await _portfolioService.GetInvestmentCountAsync(id);

                var message = canDelete
                    ? "Portfolio can be deleted"
                    : $"Portfolio cannot be deleted. It contains {investmentCount} investment(s)";

                _logger.LogInformation(
                    "User {UserId} checked if portfolio {PortfolioId} can be deleted: {CanDelete}",
                    userId, id, canDelete);

                return Ok(ApiResponse<bool>.SuccessResponse(canDelete, message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if portfolio can be deleted {PortfolioId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while checking portfolio deletion status"));
            }
        }

        /// <summary>
        /// Get investment count for portfolio
        /// </summary>
        [HttpGet("{id}/investment-count")]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPortfolioInvestmentCount(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // Verify ownership
                var portfolio = await _portfolioService.GetByIdAsync(id);
                if (portfolio == null || portfolio.UserId != userId)
                    return NotFound(ApiResponse<int>.ErrorResponse("Portfolio not found or access denied"));

                var count = await _portfolioService.GetInvestmentCountAsync(id);

                _logger.LogInformation(
                    "User {UserId} retrieved investment count for portfolio {PortfolioId}: {Count}",
                    userId, id, count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count, "Investment count retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving investment count for portfolio {PortfolioId}", id);
                return StatusCode(500, ApiResponse<int>.ErrorResponse(
                    "An error occurred while retrieving investment count"));
            }
        }

        /// <summary>
        /// Get user's total portfolio count
        /// </summary>
        [HttpGet("stats/my-count")]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyPortfolioCount()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var count = await _portfolioService.GetCountByUserIdAsync(userId);

                _logger.LogInformation("User {UserId} portfolio count: {Count}", userId, count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count, "Portfolio count retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user portfolio count");
                return StatusCode(500, ApiResponse<int>.ErrorResponse(
                    "An error occurred while retrieving portfolio count"));
            }
        }

        /// <summary>
        /// Get total portfolio count (Admin only)
        /// </summary>
        [HttpGet("stats/total")]
        [Authorize(Roles = UserRole.Admin)]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTotalPortfolioCount()
        {
            try
            {
                var count = await _portfolioService.GetTotalCountAsync();

                _logger.LogInformation("Total portfolio count retrieved: {Count}", count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count, "Total portfolio count retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving total portfolio count");
                return StatusCode(500, ApiResponse<int>.ErrorResponse(
                    "An error occurred while retrieving portfolio count"));
            }
        }
    }
}