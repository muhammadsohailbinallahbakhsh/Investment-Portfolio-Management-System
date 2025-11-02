using Backend.DTOs.Common;
using Backend.DTOs.Transaction;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Backend.AppCode.AppConstants;

namespace Backend.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IInvestmentService _investmentService;
        private readonly IActivityLogService _activityLogService;
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(
            ITransactionService transactionService,
            IInvestmentService investmentService,
            IActivityLogService activityLogService,
            ILogger<TransactionsController> logger)
        {
            _transactionService = transactionService;
            _investmentService = investmentService;
            _activityLogService = activityLogService;
            _logger = logger;
        }

        /// <summary>
        /// Get transactions with filtering, sorting, and pagination
        /// Supports: Filter by investment, type, date range; Search by investment name
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResponse<TransactionDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTransactions([FromQuery] TransactionFilterDto filterDto)
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

                var (transactions, totalCount) = await _transactionService
                    .GetFilteredTransactionsAsync(userId, filterDto, isAdmin);

                _logger.LogInformation(
                    "User {UserId} retrieved transactions. Page: {Page}, Filters: Investment={Investment}, Type={Type}, Search={Search}",
                    userId, filterDto.Page, filterDto.InvestmentId, filterDto.Type, filterDto.SearchTerm);

                return Ok(PagedResponse<TransactionDto>.Create(
                    transactions, filterDto.Page, filterDto.PageSize, totalCount));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred while retrieving transactions"));
            }
        }

        /// <summary>
        /// Get transaction by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<TransactionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTransaction(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var transaction = await _transactionService.GetByIdAsync(id);

                if (transaction == null)
                    return NotFound(ApiResponse<TransactionDto>.ErrorResponse("Transaction not found"));

                // Verify ownership through investment
                var investment = await _investmentService.GetByIdAsync(transaction.InvestmentId);
                if (investment?.UserId != userId)
                    return Forbid();

                _logger.LogInformation("User {UserId} retrieved transaction {TransactionId}", userId, id);

                return Ok(ApiResponse<TransactionDto>.SuccessResponse(
                    transaction, "Transaction retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transaction {TransactionId}", id);
                return StatusCode(500, ApiResponse<TransactionDto>.ErrorResponse(
                    "An error occurred while retrieving transaction"));
            }
        }

        /// <summary>
        /// Get transactions by investment ID
        /// </summary>
        [HttpGet("investment/{investmentId}")]
        [ProducesResponseType(typeof(ApiResponse<List<TransactionDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTransactionsByInvestment(int investmentId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // Verify investment ownership
                var investment = await _investmentService.GetByIdAsync(investmentId);
                if (investment == null || investment.UserId != userId)
                    return NotFound(ApiResponse<List<TransactionDto>>.ErrorResponse(
                        "Investment not found or access denied"));

                var transactions = await _transactionService.GetByInvestmentIdAsync(investmentId);

                _logger.LogInformation(
                    "User {UserId} retrieved transactions for investment {InvestmentId}",
                    userId, investmentId);

                return Ok(ApiResponse<List<TransactionDto>>.SuccessResponse(
                    transactions.ToList(), "Transactions retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions for investment {InvestmentId}", investmentId);
                return StatusCode(500, ApiResponse<List<TransactionDto>>.ErrorResponse(
                    "An error occurred while retrieving transactions"));
            }
        }

        /// <summary>
        /// Get recent transactions for current user (for dashboard)
        /// </summary>
        [HttpGet("recent")]
        [ProducesResponseType(typeof(ApiResponse<List<TransactionDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRecentTransactions([FromQuery] int count = 10)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (count < 1) count = 10;
                if (count > 100) count = 100;

                var transactions = await _transactionService.GetRecentByUserIdAsync(userId, count);

                _logger.LogInformation("User {UserId} retrieved {Count} recent transactions", userId, count);

                return Ok(ApiResponse<List<TransactionDto>>.SuccessResponse(
                    transactions.ToList(), "Recent transactions retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent transactions");
                return StatusCode(500, ApiResponse<List<TransactionDto>>.ErrorResponse(
                    "An error occurred while retrieving recent transactions"));
            }
        }

        /// <summary>
        /// Preview transaction impact before creating
        /// Shows new total value, validation errors, etc.
        /// </summary>
        [HttpPost("preview")]
        [ProducesResponseType(typeof(ApiResponse<TransactionPreviewResultDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PreviewTransaction([FromBody] TransactionPreviewDto previewDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    return BadRequest(ApiResponse<TransactionPreviewResultDto>.ErrorResponse(
                        "Validation failed", errors));
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var preview = await _transactionService.PreviewTransactionAsync(userId, previewDto);

                _logger.LogInformation(
                    "User {UserId} previewed {Type} transaction for investment {InvestmentId}",
                    userId, previewDto.Type, previewDto.InvestmentId);

                return Ok(ApiResponse<TransactionPreviewResultDto>.SuccessResponse(
                    preview, "Transaction preview calculated successfully"));
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized transaction preview attempt");
                return Forbid();
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid transaction preview parameters");
                return BadRequest(ApiResponse<TransactionPreviewResultDto>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error previewing transaction");
                return StatusCode(500, ApiResponse<TransactionPreviewResultDto>.ErrorResponse(
                    "An error occurred while previewing transaction"));
            }
        }

        /// <summary>
        /// Get user's active investments for dropdown selection
        /// </summary>
        [HttpGet("investments/dropdown")]
        [ProducesResponseType(typeof(ApiResponse<List<InvestmentSummaryForDropdownDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetInvestmentsForDropdown()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var investments = await _transactionService.GetUserInvestmentsForDropdownAsync(userId);

                _logger.LogInformation("User {UserId} retrieved investments dropdown list", userId);

                return Ok(ApiResponse<List<InvestmentSummaryForDropdownDto>>.SuccessResponse(
                    investments, "Investments retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving investments for dropdown");
                return StatusCode(500, ApiResponse<List<InvestmentSummaryForDropdownDto>>.ErrorResponse(
                    "An error occurred while retrieving investments"));
            }
        }

        /// <summary>
        /// Create new transaction
        /// Validates ownership, transaction type, and updates investment value
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<TransactionDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    return BadRequest(ApiResponse<TransactionDto>.ErrorResponse("Validation failed", errors));
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                // Validate transaction date is not in future
                if (createDto.TransactionDate > DateTime.UtcNow)
                    return BadRequest(ApiResponse<TransactionDto>.ErrorResponse(
                        "Transaction date cannot be in the future"));

                // Verify investment ownership
                var investment = await _investmentService.GetByIdAsync(createDto.InvestmentId);
                if (investment == null || investment.UserId != userId)
                    return NotFound(ApiResponse<TransactionDto>.ErrorResponse(
                        "Investment not found or access denied"));

                // Validate transaction type
                if (!Enum.TryParse<TransactionType>(createDto.Type, true, out var transactionType))
                    return BadRequest(ApiResponse<TransactionDto>.ErrorResponse(
                        "Invalid transaction type. Must be: Buy, Sell, or Update"));

                var transaction = await _transactionService.CreateAsync(userId, createDto);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Create,
                    EntityType.Transaction,
                    transaction.Id.ToString(),
                    $"{createDto.Type} transaction for {investment.Name}: ${createDto.Quantity * createDto.PricePerUnit:N2}");

                _logger.LogInformation(
                    "User {UserId} created {Type} transaction {TransactionId} for investment {InvestmentId}",
                    userId, createDto.Type, transaction.Id, createDto.InvestmentId);

                return CreatedAtAction(
                    nameof(GetTransaction),
                    new { id = transaction.Id },
                    ApiResponse<TransactionDto>.SuccessResponse(
                        transaction, "Transaction created successfully"));
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid transaction operation");
                return BadRequest(ApiResponse<TransactionDto>.ErrorResponse(ex.Message));
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized transaction access");
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating transaction");
                return StatusCode(500, ApiResponse<TransactionDto>.ErrorResponse(
                    "An error occurred while creating transaction"));
            }
        }

        /// <summary>
        /// Get transaction count for today (for dashboard stats)
        /// </summary>
        [HttpGet("stats/today")]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTodayTransactionCount()
        {
            try
            {
                var count = await _transactionService.GetTodayCountAsync();

                _logger.LogInformation("Today's transaction count retrieved: {Count}", count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count, "Today's transaction count retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving today's transaction count");
                return StatusCode(500, ApiResponse<int>.ErrorResponse(
                    "An error occurred while retrieving transaction count"));
            }
        }

        /// <summary>
        /// Get total transaction count
        /// </summary>
        [HttpGet("stats/total")]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTotalTransactionCount()
        {
            try
            {
                var count = await _transactionService.GetTotalCountAsync();

                _logger.LogInformation("Total transaction count retrieved: {Count}", count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count, "Total transaction count retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving total transaction count");
                return StatusCode(500, ApiResponse<int>.ErrorResponse(
                    "An error occurred while retrieving transaction count"));
            }
        }

        /// <summary>
        /// Get user's transaction count
        /// </summary>
        [HttpGet("stats/my-count")]
        [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyTransactionCount()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var count = await _transactionService.GetCountByUserIdAsync(userId);

                _logger.LogInformation("User {UserId} transaction count: {Count}", userId, count);

                return Ok(ApiResponse<int>.SuccessResponse(
                    count, "Transaction count retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user transaction count");
                return StatusCode(500, ApiResponse<int>.ErrorResponse(
                    "An error occurred while retrieving transaction count"));
            }
        }
    }
}