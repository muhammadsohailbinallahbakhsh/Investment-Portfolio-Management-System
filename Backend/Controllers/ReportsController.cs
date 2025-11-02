using Backend.DTOs.Common;
using Backend.DTOs.Reports;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    /// <summary>
    /// Reports & Analytics Controller
    /// All endpoints require authentication
    /// </summary>
    [Route("api/reports")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;
        private readonly IActivityLogService _activityLogService;
        private readonly ILogger<ReportsController> _logger;

        public ReportsController(
            IReportsService reportsService,
            IActivityLogService activityLogService,
            ILogger<ReportsController> logger)
        {
            _reportsService = reportsService;
            _activityLogService = activityLogService;
            _logger = logger;
        }

        // ==========================================
        // REPORT GENERATION ENDPOINTS
        // ==========================================

        /// <summary>
        /// Generate Performance Summary Report
        /// Overall portfolio performance with top performers and trends
        /// </summary>
        [HttpGet("performance-summary")]
        [ProducesResponseType(typeof(ApiResponse<PerformanceSummaryReport>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPerformanceSummary([FromQuery] ReportDateRangeDto dateRange)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // Parse preset range if provided
                DateTime? startDate = dateRange.StartDate;
                DateTime? endDate = dateRange.EndDate;

                if (!string.IsNullOrEmpty(dateRange.PresetRange))
                {
                    (startDate, endDate) = _reportsService.ParsePresetDateRange(dateRange.PresetRange);
                }

                var report = await _reportsService.GeneratePerformanceSummaryReportAsync(
                    userId, startDate, endDate);

                _logger.LogInformation(
                    "User {UserId} generated performance summary report", userId);

                return Ok(ApiResponse<PerformanceSummaryReport>.SuccessResponse(
                    report, "Performance summary report generated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating performance summary report");
                return StatusCode(500, ApiResponse<PerformanceSummaryReport>.ErrorResponse(
                    "An error occurred while generating the report"));
            }
        }

        /// <summary>
        /// Generate Investment Distribution Report
        /// Portfolio composition and allocation analysis
        /// </summary>
        [HttpGet("investment-distribution")]
        [ProducesResponseType(typeof(ApiResponse<InvestmentDistributionReport>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetInvestmentDistribution()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var report = await _reportsService.GenerateInvestmentDistributionReportAsync(userId);

                _logger.LogInformation(
                    "User {UserId} generated investment distribution report", userId);

                return Ok(ApiResponse<InvestmentDistributionReport>.SuccessResponse(
                    report, "Investment distribution report generated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating investment distribution report");
                return StatusCode(500, ApiResponse<InvestmentDistributionReport>.ErrorResponse(
                    "An error occurred while generating the report"));
            }
        }

        /// <summary>
        /// Generate Transaction History Report
        /// Detailed transaction log with filtering
        /// </summary>
        [HttpGet("transaction-history")]
        [ProducesResponseType(typeof(ApiResponse<TransactionHistoryReport>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTransactionHistory([FromQuery] ReportDateRangeDto dateRange)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                DateTime? startDate = dateRange.StartDate;
                DateTime? endDate = dateRange.EndDate;

                if (!string.IsNullOrEmpty(dateRange.PresetRange))
                {
                    (startDate, endDate) = _reportsService.ParsePresetDateRange(dateRange.PresetRange);
                }

                var report = await _reportsService.GenerateTransactionHistoryReportAsync(
                    userId, startDate, endDate);

                _logger.LogInformation(
                    "User {UserId} generated transaction history report", userId);

                return Ok(ApiResponse<TransactionHistoryReport>.SuccessResponse(
                    report, "Transaction history report generated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating transaction history report");
                return StatusCode(500, ApiResponse<TransactionHistoryReport>.ErrorResponse(
                    "An error occurred while generating the report"));
            }
        }

        /// <summary>
        /// Generate Monthly Performance Trend Report
        /// Month-by-month performance analysis with chart data
        /// </summary>
        [HttpGet("monthly-performance-trend")]
        [ProducesResponseType(typeof(ApiResponse<MonthlyPerformanceTrendReport>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMonthlyPerformanceTrend([FromQuery] int months = 12)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (months < 1) months = 12;
                if (months > 36) months = 36;

                var report = await _reportsService.GenerateMonthlyPerformanceTrendReportAsync(
                    userId, months);

                _logger.LogInformation(
                    "User {UserId} generated monthly performance trend report ({Months} months)",
                    userId, months);

                return Ok(ApiResponse<MonthlyPerformanceTrendReport>.SuccessResponse(
                    report, "Monthly performance trend report generated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating monthly performance trend report");
                return StatusCode(500, ApiResponse<MonthlyPerformanceTrendReport>.ErrorResponse(
                    "An error occurred while generating the report"));
            }
        }

        /// <summary>
        /// Generate Year-over-Year Comparison Report
        /// Compare performance across years
        /// </summary>
        [HttpGet("year-over-year")]
        [ProducesResponseType(typeof(ApiResponse<YearOverYearReport>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetYearOverYearComparison()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var report = await _reportsService.GenerateYearOverYearReportAsync(userId);

                _logger.LogInformation(
                    "User {UserId} generated year-over-year comparison report", userId);

                return Ok(ApiResponse<YearOverYearReport>.SuccessResponse(
                    report, "Year-over-year comparison report generated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating year-over-year report");
                return StatusCode(500, ApiResponse<YearOverYearReport>.ErrorResponse(
                    "An error occurred while generating the report"));
            }
        }

        /// <summary>
        /// Generate Top Performing Investments Report
        /// Detailed analysis of best performers
        /// </summary>
        [HttpGet("top-performing")]
        [ProducesResponseType(typeof(ApiResponse<TopPerformingInvestmentsReport>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTopPerforming(
            [FromQuery] ReportDateRangeDto dateRange,
            [FromQuery] int count = 10)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (count < 1) count = 10;
                if (count > 50) count = 50;

                DateTime? startDate = dateRange.StartDate;
                DateTime? endDate = dateRange.EndDate;

                if (!string.IsNullOrEmpty(dateRange.PresetRange))
                {
                    (startDate, endDate) = _reportsService.ParsePresetDateRange(dateRange.PresetRange);
                }

                var report = await _reportsService.GenerateTopPerformingInvestmentsReportAsync(
                    userId, startDate, endDate, count);

                _logger.LogInformation(
                    "User {UserId} generated top performing investments report (Top {Count})",
                    userId, count);

                return Ok(ApiResponse<TopPerformingInvestmentsReport>.SuccessResponse(
                    report, "Top performing investments report generated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating top performing investments report");
                return StatusCode(500, ApiResponse<TopPerformingInvestmentsReport>.ErrorResponse(
                    "An error occurred while generating the report"));
            }
        }

        // ==========================================
        // EXPORT ENDPOINTS
        // ==========================================

        /// <summary>
        /// Export report to CSV format
        /// </summary>
        [HttpGet("export/csv")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        public async Task<IActionResult> ExportToCsv(
            [FromQuery] string reportType,
            [FromQuery] ReportDateRangeDto dateRange)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                DateTime? startDate = dateRange.StartDate;
                DateTime? endDate = dateRange.EndDate;

                if (!string.IsNullOrEmpty(dateRange.PresetRange))
                {
                    (startDate, endDate) = _reportsService.ParsePresetDateRange(dateRange.PresetRange);
                }

                var csvData = await _reportsService.ExportReportToCsvAsync(
                    userId, reportType, startDate, endDate);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    Backend.AppCode.AppConstants.ActivityAction.Export,
                    Backend.AppCode.AppConstants.EntityType.Investment,
                    null,
                    $"Exported {reportType} report to CSV");

                _logger.LogInformation(
                    "User {UserId} exported {ReportType} report to CSV",
                    userId, reportType);

                var fileName = $"{reportType}_report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
                return File(csvData, "text/csv", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting report to CSV");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while exporting the report"));
            }
        }

        /// <summary>
        /// Export report to JSON format
        /// </summary>
        [HttpGet("export/json")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        public async Task<IActionResult> ExportToJson(
            [FromQuery] string reportType,
            [FromQuery] ReportDateRangeDto dateRange)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                DateTime? startDate = dateRange.StartDate;
                DateTime? endDate = dateRange.EndDate;

                if (!string.IsNullOrEmpty(dateRange.PresetRange))
                {
                    (startDate, endDate) = _reportsService.ParsePresetDateRange(dateRange.PresetRange);
                }

                var jsonData = await _reportsService.ExportReportToJsonAsync(
                    userId, reportType, startDate, endDate);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    Backend.AppCode.AppConstants.ActivityAction.Export,
                    Backend.AppCode.AppConstants.EntityType.Investment,
                    null,
                    $"Exported {reportType} report to JSON");

                _logger.LogInformation(
                    "User {UserId} exported {ReportType} report to JSON",
                    userId, reportType);

                var fileName = $"{reportType}_report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.json";
                var jsonBytes = System.Text.Encoding.UTF8.GetBytes(jsonData);
                return File(jsonBytes, "application/json", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting report to JSON");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while exporting the report"));
            }
        }

        /// <summary>
        /// Export report to PDF format (simulated)
        /// Returns JSON with PDF metadata for simulation
        /// </summary>
        [HttpGet("export/pdf")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ExportToPdf(
            [FromQuery] string reportType,
            [FromQuery] ReportDateRangeDto dateRange)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                DateTime? startDate = dateRange.StartDate;
                DateTime? endDate = dateRange.EndDate;

                if (!string.IsNullOrEmpty(dateRange.PresetRange))
                {
                    (startDate, endDate) = _reportsService.ParsePresetDateRange(dateRange.PresetRange);
                }

                var pdfData = await _reportsService.ExportReportToPdfAsync(
                    userId, reportType, startDate, endDate);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    Backend.AppCode.AppConstants.ActivityAction.Export,
                    Backend.AppCode.AppConstants.EntityType.Investment,
                    null,
                    $"Exported {reportType} report to PDF (simulated)");

                _logger.LogInformation(
                    "User {UserId} exported {ReportType} report to PDF (simulated)",
                    userId, reportType);

                return Ok(ApiResponse<object>.SuccessResponse(
                    pdfData,
                    "PDF export simulated successfully. In production, this would generate a PDF file."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error simulating PDF export");
                return StatusCode(500, ApiResponse<object>.ErrorResponse(
                    "An error occurred while exporting the report"));
            }
        }

        // ==========================================
        // UTILITY ENDPOINTS
        // ==========================================

        /// <summary>
        /// Get list of available report types
        /// </summary>
        [HttpGet("types")]
        [ProducesResponseType(typeof(ApiResponse<List<string>>), StatusCodes.Status200OK)]
        public IActionResult GetReportTypes()
        {
            try
            {
                var reportTypes = _reportsService.GetAvailableReportTypes();

                return Ok(ApiResponse<List<string>>.SuccessResponse(
                    reportTypes, "Available report types retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving report types");
                return StatusCode(500, ApiResponse<List<string>>.ErrorResponse(
                    "An error occurred while retrieving report types"));
            }
        }

        /// <summary>
        /// Get available preset date ranges
        /// </summary>
        [HttpGet("preset-ranges")]
        [ProducesResponseType(typeof(ApiResponse<List<object>>), StatusCodes.Status200OK)]
        public IActionResult GetPresetDateRanges()
        {
            var presetRanges = new List<object>
            {
                new { value = "last7days", label = "Last 7 Days" },
                new { value = "last30days", label = "Last 30 Days" },
                new { value = "last3months", label = "Last 3 Months" },
                new { value = "last6months", label = "Last 6 Months" },
                new { value = "last12months", label = "Last 12 Months" },
                new { value = "thisyear", label = "This Year" },
                new { value = "lastyear", label = "Last Year" },
                new { value = "alltime", label = "All Time" }
            };

            return Ok(ApiResponse<List<object>>.SuccessResponse(
                presetRanges, "Preset date ranges retrieved successfully"));
        }
    }
}