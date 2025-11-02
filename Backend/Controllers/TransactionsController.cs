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
        /// Get all transactions with pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResponse<TransactionDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTransactions(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var transactions = await _transactionService.GetAllAsync(page, pageSize);
                var totalCount = await _transactionService.GetTotalCountAsync();

                // Filter by user's investments
                var transactionsList = transactions.ToList();
                var userTransactions = new List<TransactionDto>();

                foreach (var transaction in transactionsList)
                {
                    var investment = await _investmentService.GetByIdAsync(transaction.InvestmentId);
                    if (investment?.UserId == userId)
                    {
                        userTransactions.Add(transaction);
                    }
                }

                _logger.LogInformation("User {UserId} retrieved transactions. Page: {Page}", userId, page);

                return Ok(PagedResponse<TransactionDto>.Create(
                    userTransactions, page, pageSize, userTransactions.Count));
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
        /// Get recent transactions for current user
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
        /// Create new transaction
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

                // Additional validation for Sell transactions
                if (transactionType == TransactionType.Sell)
                {
                    var sellAmount = createDto.Quantity * createDto.PricePerUnit;
                    if (investment.CurrentValue < sellAmount)
                        return BadRequest(ApiResponse<TransactionDto>.ErrorResponse(
                            "Cannot sell more than the current investment value"));
                }

                var transaction = await _transactionService.CreateAsync(userId, createDto);

                // Log activity
                await _activityLogService.LogActivityAsync(
                    userId,
                    ActivityAction.Create,
                    EntityType.Transaction,
                    transaction.Id.ToString(),
                    $"{createDto.Type} transaction for {investment.Name}: {createDto.Quantity:C}");

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
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var count = await _transactionService.GetTodayCountAsync();

                _logger.LogInformation("User {UserId} retrieved today's transaction count", userId);

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
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

                var count = await _transactionService.GetTotalCountAsync();

                _logger.LogInformation("User {UserId} retrieved total transaction count", userId);

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
    }
}