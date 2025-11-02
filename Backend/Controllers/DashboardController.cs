using Backend.DTOs.Common;
using Backend.DTOs.Dashboard;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    /// <summary>
    /// User Dashboard Controller for Portfolio Owners
    /// All endpoints require authentication
    /// </summary>
    [Route("api/dashboard")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            IDashboardService dashboardService,
            ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        // ==========================================
        // MAIN DASHBOARD ENDPOINT
        // ==========================================

        /// <summary>
        /// Get complete user dashboard data
        /// This is the main endpoint for the user dashboard page
        /// Includes: Summary cards, recent transactions, performance chart, asset allocation
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<UserDashboardDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var dashboardData = await _dashboardService.GetUserDashboardAsync(userId);

                _logger.LogInformation("User {UserId} accessed dashboard", userId);

                return Ok(ApiResponse<UserDashboardDto>.SuccessResponse(
                    dashboardData,
                    "Dashboard data retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user dashboard");
                return StatusCode(500, ApiResponse<UserDashboardDto>.ErrorResponse(
                    "An error occurred while retrieving dashboard data"));
            }
        }

        // ==========================================
        // SUMMARY CARDS
        // ==========================================

        /// <summary>
        /// Get portfolio summary cards data
        /// Returns: Total Investment Value, Gain/Loss, Active Investments, Best/Worst Performing
        /// </summary>
        [HttpGet("summary")]
        [ProducesResponseType(typeof(ApiResponse<PortfolioSummaryCards>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSummaryCards()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var summaryCards = await _dashboardService.GetSummaryCardsAsync(userId);

                _logger.LogInformation("User {UserId} retrieved summary cards", userId);

                return Ok(ApiResponse<PortfolioSummaryCards>.SuccessResponse(
                    summaryCards,
                    "Summary cards retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving summary cards");
                return StatusCode(500, ApiResponse<PortfolioSummaryCards>.ErrorResponse(
                    "An error occurred while retrieving summary cards"));
            }
        }

        // ==========================================
        // RECENT TRANSACTIONS
        // ==========================================

        /// <summary>
        /// Get recent transactions for dashboard table (last 10 by default)
        /// </summary>
        [HttpGet("recent-transactions")]
        [ProducesResponseType(typeof(ApiResponse<List<RecentTransactionDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRecentTransactions([FromQuery] int count = 10)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (count < 1) count = 10;
                if (count > 50) count = 50;

                var transactions = await _dashboardService.GetRecentTransactionsAsync(userId, count);

                _logger.LogInformation(
                    "User {UserId} retrieved {Count} recent transactions",
                    userId, count);

                return Ok(ApiResponse<List<RecentTransactionDto>>.SuccessResponse(
                    transactions,
                    "Recent transactions retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent transactions");
                return StatusCode(500, ApiResponse<List<RecentTransactionDto>>.ErrorResponse(
                    "An error occurred while retrieving recent transactions"));
            }
        }

        // ==========================================
        // PERFORMANCE CHART
        // ==========================================

        /// <summary>
        /// Get performance chart data (line/area chart - 12 months by default)
        /// Shows portfolio value progression over time
        /// </summary>
        [HttpGet("performance-chart")]
        [ProducesResponseType(typeof(ApiResponse<PerformanceChartData>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPerformanceChart([FromQuery] int months = 12)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (months < 1) months = 12;
                if (months > 36) months = 36; // Max 3 years

                var chartData = await _dashboardService.GetPerformanceChartDataAsync(userId, months);

                _logger.LogInformation(
                    "User {UserId} retrieved performance chart ({Months} months)",
                    userId, months);

                return Ok(ApiResponse<PerformanceChartData>.SuccessResponse(
                    chartData,
                    "Performance chart data retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving performance chart");
                return StatusCode(500, ApiResponse<PerformanceChartData>.ErrorResponse(
                    "An error occurred while retrieving performance chart data"));
            }
        }

        /// <summary>
        /// Get monthly performance summaries
        /// Detailed breakdown by month
        /// </summary>
        [HttpGet("monthly-performance")]
        [ProducesResponseType(typeof(ApiResponse<List<MonthlyPerformanceSummary>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMonthlyPerformance([FromQuery] int months = 12)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (months < 1) months = 12;
                if (months > 36) months = 36;

                var summaries = await _dashboardService.GetMonthlyPerformanceSummariesAsync(userId, months);

                _logger.LogInformation(
                    "User {UserId} retrieved monthly performance ({Months} months)",
                    userId, months);

                return Ok(ApiResponse<List<MonthlyPerformanceSummary>>.SuccessResponse(
                    summaries,
                    "Monthly performance summaries retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving monthly performance");
                return StatusCode(500, ApiResponse<List<MonthlyPerformanceSummary>>.ErrorResponse(
                    "An error occurred while retrieving monthly performance"));
            }
        }

        // ==========================================
        // ASSET ALLOCATION
        // ==========================================

        /// <summary>
        /// Get asset allocation data (pie/donut chart by investment type)
        /// Shows distribution of investments by type
        /// </summary>
        [HttpGet("asset-allocation")]
        [ProducesResponseType(typeof(ApiResponse<AssetAllocationData>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAssetAllocation()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var allocationData = await _dashboardService.GetAssetAllocationAsync(userId);

                _logger.LogInformation("User {UserId} retrieved asset allocation", userId);

                return Ok(ApiResponse<AssetAllocationData>.SuccessResponse(
                    allocationData,
                    "Asset allocation data retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving asset allocation");
                return StatusCode(500, ApiResponse<AssetAllocationData>.ErrorResponse(
                    "An error occurred while retrieving asset allocation data"));
            }
        }

        // ==========================================
        // ADDITIONAL DASHBOARD DATA
        // ==========================================

        /// <summary>
        /// Get quick stats for dashboard header
        /// Shows: Today's gain/loss, Transactions this month, Monthly growth
        /// </summary>
        [HttpGet("quick-stats")]
        [ProducesResponseType(typeof(ApiResponse<DashboardQuickStats>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetQuickStats()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var quickStats = await _dashboardService.GetQuickStatsAsync(userId);

                _logger.LogInformation("User {UserId} retrieved quick stats", userId);

                return Ok(ApiResponse<DashboardQuickStats>.SuccessResponse(
                    quickStats,
                    "Quick stats retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quick stats");
                return StatusCode(500, ApiResponse<DashboardQuickStats>.ErrorResponse(
                    "An error occurred while retrieving quick stats"));
            }
        }

        /// <summary>
        /// Get portfolio breakdown by status
        /// Shows: Active, Sold, On Hold investments and their values
        /// </summary>
        [HttpGet("portfolio-breakdown")]
        [ProducesResponseType(typeof(ApiResponse<PortfolioBreakdown>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPortfolioBreakdown()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var breakdown = await _dashboardService.GetPortfolioBreakdownAsync(userId);

                _logger.LogInformation("User {UserId} retrieved portfolio breakdown", userId);

                return Ok(ApiResponse<PortfolioBreakdown>.SuccessResponse(
                    breakdown,
                    "Portfolio breakdown retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio breakdown");
                return StatusCode(500, ApiResponse<PortfolioBreakdown>.ErrorResponse(
                    "An error occurred while retrieving portfolio breakdown"));
            }
        }

        /// <summary>
        /// Get top performing investments
        /// </summary>
        [HttpGet("top-performing")]
        [ProducesResponseType(typeof(ApiResponse<List<InvestmentPerformanceCard>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTopPerforming([FromQuery] int count = 5)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (count < 1) count = 5;
                if (count > 20) count = 20;

                var topPerforming = await _dashboardService.GetTopPerformingInvestmentsAsync(userId, count);

                _logger.LogInformation(
                    "User {UserId} retrieved top {Count} performing investments",
                    userId, count);

                return Ok(ApiResponse<List<InvestmentPerformanceCard>>.SuccessResponse(
                    topPerforming,
                    "Top performing investments retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving top performing investments");
                return StatusCode(500, ApiResponse<List<InvestmentPerformanceCard>>.ErrorResponse(
                    "An error occurred while retrieving top performing investments"));
            }
        }

        /// <summary>
        /// Get worst performing investments
        /// </summary>
        [HttpGet("worst-performing")]
        [ProducesResponseType(typeof(ApiResponse<List<InvestmentPerformanceCard>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetWorstPerforming([FromQuery] int count = 5)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (count < 1) count = 5;
                if (count > 20) count = 20;

                var worstPerforming = await _dashboardService.GetWorstPerformingInvestmentsAsync(userId, count);

                _logger.LogInformation(
                    "User {UserId} retrieved worst {Count} performing investments",
                    userId, count);

                return Ok(ApiResponse<List<InvestmentPerformanceCard>>.SuccessResponse(
                    worstPerforming,
                    "Worst performing investments retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving worst performing investments");
                return StatusCode(500, ApiResponse<List<InvestmentPerformanceCard>>.ErrorResponse(
                    "An error occurred while retrieving worst performing investments"));
            }
        }
    }
}