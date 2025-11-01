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

        private static TransactionDto MapToDto(Transaction t) => new()
        {
            Id = t.Id,
            InvestmentId = t.InvestmentId,
            InvestmentName = t.Investment?.Name ?? string.Empty,
            Type = t.Type.ToString(),
            Quantity = t.Quantity,
            PricePerUnit = t.PricePerUnit,
            Amount = t.Amount,
            TransactionDate = t.TransactionDate,
            Notes = t.Notes,
            CreatedAt = t.CreatedAt
        };
    }
}
