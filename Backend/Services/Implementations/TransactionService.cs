using Backend.DTOs.Transaction;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using static Backend.AppCode.AppConstants;

namespace Backend.Services.Implementations
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IInvestmentRepository _investmentRepository;

        public TransactionService(ITransactionRepository transactionRepository, IInvestmentRepository investmentRepository)
        {
            _transactionRepository = transactionRepository;
            _investmentRepository = investmentRepository;
        }

        public async Task<TransactionDto?> GetByIdAsync(int id)
        {
            var transaction = await _transactionRepository.GetByIdAsync(id);
            return transaction != null ? MapToDto(transaction) : null;
        }

        public async Task<IEnumerable<TransactionDto>> GetByInvestmentIdAsync(int investmentId)
        {
            var transactions = await _transactionRepository.GetByInvestmentIdAsync(investmentId);
            return transactions.Select(MapToDto);
        }

        public async Task<IEnumerable<TransactionDto>> GetAllAsync(int page, int pageSize)
        {
            var transactions = await _transactionRepository.GetAllAsync(page, pageSize);
            return transactions.Select(MapToDto);
        }

        public async Task<IEnumerable<TransactionDto>> GetRecentByUserIdAsync(string userId, int count)
        {
            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, count);
            return transactions.Select(MapToDto);
        }

        public async Task<int> GetTotalCountAsync() => await _transactionRepository.GetTotalCountAsync();
        public async Task<int> GetTodayCountAsync() => await _transactionRepository.GetTodayCountAsync();

        public async Task<TransactionDto> CreateAsync(string userId, CreateTransactionDto createDto)
        {
            var investment = await _investmentRepository.GetByIdAsync(createDto.InvestmentId);
            if (investment == null || investment.UserId != userId)
                throw new UnauthorizedAccessException("Investment not found or unauthorized.");

            var type = Enum.Parse<TransactionType>(createDto.Type, true);

            // Update investment based on transaction type
            switch (type)
            {
                case TransactionType.Buy:
                    investment.CurrentValue += createDto.Quantity * createDto.PricePerUnit;
                    break;

                case TransactionType.Sell:
                    var sellAmount = createDto.Quantity * createDto.PricePerUnit;
                    if (investment.CurrentValue < sellAmount)
                        throw new InvalidOperationException("Cannot sell more than the current investment value.");
                    investment.CurrentValue -= sellAmount;
                    break;

                case TransactionType.Update:
                    // Recalculate current value based on new quantity and price
                    var newValue = createDto.Quantity * createDto.PricePerUnit;

                    // Validation: prevent negative values
                    if (newValue < 0)
                        throw new InvalidOperationException("Updated value cannot be negative.");

                    if (createDto.Quantity <= 0)
                        throw new InvalidOperationException("Quantity must be greater than zero.");

                    if (createDto.PricePerUnit <= 0)
                        throw new InvalidOperationException("Price per unit must be greater than zero.");

                    // Update investment values
                    investment.CurrentValue = newValue;
                    investment.Quantity = createDto.Quantity;
                    investment.AveragePricePerUnit = createDto.PricePerUnit;

                    break;
            }

            await _investmentRepository.UpdateAsync(investment);

            var transaction = new Transaction
            {
                InvestmentId = createDto.InvestmentId,
                Type = type,
                Quantity = createDto.Quantity,
                PricePerUnit = createDto.PricePerUnit,
                Amount = createDto.Quantity * createDto.PricePerUnit,
                Notes = createDto.Notes,
                TransactionDate = createDto.TransactionDate
            };

            var created = await _transactionRepository.CreateAsync(transaction);
            created.Investment = investment;

            return MapToDto(created);
        }

        public async Task<(List<TransactionDto> transactions, int totalCount)> GetFilteredTransactionsAsync(
            string userId,
            TransactionFilterDto filterDto,
            bool isAdmin = false)
        {
            // Get all transactions (we'll filter in memory for simplicity)
            var allTransactions = isAdmin
                ? await _transactionRepository.GetAllAsync(1, int.MaxValue)
                : await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);

            var query = allTransactions.AsQueryable();

            // Filter by investment ID
            if (filterDto.InvestmentId.HasValue)
            {
                query = query.Where(t => t.InvestmentId == filterDto.InvestmentId.Value);
            }

            // Filter by transaction type
            if (!string.IsNullOrWhiteSpace(filterDto.Type))
            {
                if (Enum.TryParse<TransactionType>(filterDto.Type, true, out var transactionType))
                {
                    query = query.Where(t => t.Type == transactionType);
                }
            }

            // Filter by date range
            if (filterDto.StartDate.HasValue)
            {
                query = query.Where(t => t.TransactionDate >= filterDto.StartDate.Value);
            }
            if (filterDto.EndDate.HasValue)
            {
                query = query.Where(t => t.TransactionDate <= filterDto.EndDate.Value);
            }

            // Search by investment name
            if (!string.IsNullOrWhiteSpace(filterDto.SearchTerm))
            {
                query = query.Where(t =>
                    t.Investment != null &&
                    t.Investment.Name.Contains(filterDto.SearchTerm, StringComparison.OrdinalIgnoreCase));
            }

            // Convert to DTOs
            var transactionDtos = query.Select(MapToDto).ToList();

            // Apply sorting
            transactionDtos = ApplySorting(transactionDtos, filterDto.SortBy, filterDto.SortOrder);

            var totalCount = transactionDtos.Count;

            // Apply pagination
            var paginatedList = transactionDtos
                .Skip((filterDto.Page - 1) * filterDto.PageSize)
                .Take(filterDto.PageSize)
                .ToList();

            return (paginatedList, totalCount);
        }

        public async Task<TransactionPreviewResultDto> PreviewTransactionAsync(
            string userId,
            TransactionPreviewDto previewDto)
        {
            var investment = await _investmentRepository.GetByIdAsync(previewDto.InvestmentId);

            if (investment == null || investment.UserId != userId)
            {
                throw new UnauthorizedAccessException("Investment not found or unauthorized.");
            }

            if (!Enum.TryParse<TransactionType>(previewDto.Type, true, out var transactionType))
            {
                throw new ArgumentException("Invalid transaction type. Must be: Buy, Sell, or Update");
            }

            var transactionAmount = previewDto.Quantity * previewDto.PricePerUnit;
            var currentValue = investment.CurrentValue;
            decimal newTotalValue;
            bool isValid = true;
            string? validationMessage = null;
            decimal? newQuantity = null;
            decimal? newAveragePricePerUnit = null;

            switch (transactionType)
            {
                case TransactionType.Buy:
                    newTotalValue = currentValue + transactionAmount;
                    break;

                case TransactionType.Sell:
                    newTotalValue = currentValue - transactionAmount;
                    if (newTotalValue < 0)
                    {
                        isValid = false;
                        validationMessage = $"Cannot sell ${transactionAmount:N2}. Current value is only ${currentValue:N2}. You would be short by ${Math.Abs(newTotalValue):N2}.";
                        newTotalValue = currentValue; // Reset for display
                    }
                    break;

                case TransactionType.Update:
                    newTotalValue = transactionAmount;
                    newQuantity = previewDto.Quantity;
                    newAveragePricePerUnit = previewDto.PricePerUnit;

                    if (newTotalValue <= 0)
                    {
                        isValid = false;
                        validationMessage = "Update would result in zero or negative value.";
                    }
                    break;

                default:
                    throw new ArgumentException("Invalid transaction type");
            }

            var valueChange = newTotalValue - currentValue;
            var valueChangePercentage = currentValue > 0
                ? Math.Round((valueChange / currentValue) * 100, 2)
                : 0;

            return new TransactionPreviewResultDto
            {
                InvestmentName = investment.Name,
                CurrentValue = currentValue,
                TransactionAmount = transactionAmount,
                NewTotalValue = newTotalValue,
                ValueChange = valueChange,
                ValueChangePercentage = valueChangePercentage,
                IsValid = isValid,
                ValidationMessage = validationMessage,
                NewQuantity = newQuantity,
                NewAveragePricePerUnit = newAveragePricePerUnit
            };
        }

        public async Task<List<InvestmentSummaryForDropdownDto>> GetUserInvestmentsForDropdownAsync(string userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);

            // Only return active investments for transactions
            return investments
                .Where(i => i.Status == InvestmentStatus.Active)
                .Select(i => new InvestmentSummaryForDropdownDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Type = i.Type.ToString(),
                    CurrentValue = i.CurrentValue,
                    Status = i.Status.ToString()
                })
                .OrderBy(i => i.Name)
                .ToList();
        }

        public async Task<int> GetCountByUserIdAsync(string userId)
        {
            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            return transactions.Count();
        }

        // ==========================================
        // HELPER METHODS
        // ==========================================

        private List<TransactionDto> ApplySorting(
            List<TransactionDto> transactions,
            string? sortBy,
            string? sortOrder)
        {
            var isDescending = sortOrder?.ToLower() == "desc";

            return sortBy?.ToLower() switch
            {
                "amount" => isDescending
                    ? transactions.OrderByDescending(t => t.Amount).ToList()
                    : transactions.OrderBy(t => t.Amount).ToList(),

                "transactiondate" => isDescending
                    ? transactions.OrderByDescending(t => t.TransactionDate).ToList()
                    : transactions.OrderBy(t => t.TransactionDate).ToList(),

                _ => transactions.OrderByDescending(t => t.TransactionDate).ToList()
            };
        }

        private static TransactionDto MapToDto(Transaction t) => new()
        {
            Id = t.Id,
            InvestmentId = t.InvestmentId,
            InvestmentName = t.Investment?.Name ?? string.Empty,
            InvestmentType = t.Investment?.Type.ToString() ?? string.Empty,
            Type = t.Type.ToString(),
            Quantity = t.Quantity,
            PricePerUnit = t.PricePerUnit,
            Amount = t.Amount,
            TransactionDate = t.TransactionDate,
            Notes = t.Notes,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt
        };
    }
}
