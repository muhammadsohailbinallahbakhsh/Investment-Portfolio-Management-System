using Backend.DTOs.Investment;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using static Backend.AppCode.AppConstants;

namespace Backend.Services.Implementations
{
    public class InvestmentService : IInvestmentService
    {
        private readonly IInvestmentRepository _investmentRepository;

        public InvestmentService(IInvestmentRepository investmentRepository)
        {
            _investmentRepository = investmentRepository;
        }

        public async Task<InvestmentDto?> GetByIdAsync(int id)
        {
            var investment = await _investmentRepository.GetByIdAsync(id);
            return investment != null ? MapToDto(investment) : null;
        }

        public async Task<IEnumerable<InvestmentDto>> GetByUserIdAsync(string userId, int page, int pageSize)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId, page, pageSize);
            return investments.Select(MapToDto);
        }

        public async Task<IEnumerable<InvestmentDto>> GetByPortfolioIdAsync(int portfolioId, int page, int pageSize)
        {
            var investments = await _investmentRepository.GetByPortfolioIdAsync(portfolioId, page, pageSize);
            return investments.Select(MapToDto);
        }

        public async Task<IEnumerable<InvestmentDto>> GetAllAsync(int page, int pageSize)
        {
            var investments = await _investmentRepository.GetAllAsync(page, pageSize);
            return investments.Select(MapToDto);
        }

        public async Task<int> GetTotalCountAsync() => await _investmentRepository.GetTotalCountAsync();

        public async Task<int> GetCountByUserIdAsync(string userId) => await _investmentRepository.GetCountByUserIdAsync(userId);

        public async Task<decimal> GetTotalValueAsync() => await _investmentRepository.GetTotalValueAsync();

        public async Task<decimal> GetTotalValueByUserIdAsync(string userId) => await _investmentRepository.GetTotalValueByUserIdAsync(userId);

        public async Task<InvestmentDto> CreateAsync(string userId, CreateInvestmentDto createDto)
        {
            var investment = new Investment
            {
                UserId = userId,
                PortfolioId = createDto.PortfolioId,
                Name = createDto.Name,
                Type = Enum.Parse<InvestmentType>(createDto.Type, true),
                InitialAmount = createDto.InitialAmount,
                CurrentValue = createDto.InitialAmount,
                Quantity = createDto.Quantity,
                AveragePricePerUnit = createDto.AveragePricePerUnit,
                PurchaseDate = createDto.PurchaseDate,
                BrokerPlatform = createDto.BrokerPlatform,
                Notes = createDto.Notes,
                Status = Enum.Parse<InvestmentStatus>(createDto.Status, true)
            };

            var created = await _investmentRepository.CreateAsync(investment);
            return MapToDto(created);
        }

        public async Task<bool> UpdateAsync(int id, string userId, UpdateInvestmentDto updateDto)
        {
            var investment = await _investmentRepository.GetByIdAsync(id);
            if (investment == null || investment.UserId != userId) return false;

            investment.Name = updateDto.Name;
            investment.Type = Enum.Parse<InvestmentType>(updateDto.Type, true);
            investment.InitialAmount = updateDto.InitialAmount;
            investment.Quantity = updateDto.Quantity;
            investment.AveragePricePerUnit = updateDto.AveragePricePerUnit;
            investment.PurchaseDate = updateDto.PurchaseDate;
            investment.BrokerPlatform = updateDto.BrokerPlatform;
            investment.Notes = updateDto.Notes;
            investment.Status = Enum.Parse<InvestmentStatus>(updateDto.Status, true);

            return await _investmentRepository.UpdateAsync(investment);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var investment = await _investmentRepository.GetByIdAsync(id);
            if (investment == null || investment.UserId != userId) return false;
            return await _investmentRepository.SoftDeleteAsync(id);
        }

        public async Task<IEnumerable<InvestmentDto>> SearchAsync(string? searchTerm, InvestmentType? type, InvestmentStatus? status, DateTime? startDate, DateTime? endDate)
        {
            var investments = await _investmentRepository.SearchAsync(searchTerm, type, status, startDate, endDate);
            return investments.Select(MapToDto);
        }

        private static InvestmentDto MapToDto(Investment investment)
        {
            var gainLoss = investment.CurrentValue - investment.InitialAmount;
            var gainLossPercentage = investment.InitialAmount > 0 ? (gainLoss / investment.InitialAmount) * 100 : 0;

            return new InvestmentDto
            {
                Id = investment.Id,
                UserId = investment.UserId,
                PortfolioId = investment.PortfolioId,
                PortfolioName = investment.Portfolio?.Name,
                Name = investment.Name,
                Type = investment.Type.ToString(),
                InitialAmount = investment.InitialAmount,
                CurrentValue = investment.CurrentValue,
                Quantity = investment.Quantity,
                AveragePricePerUnit = investment.AveragePricePerUnit,
                PurchaseDate = investment.PurchaseDate,
                BrokerPlatform = investment.BrokerPlatform,
                Notes = investment.Notes,
                Status = investment.Status.ToString(),
                CreatedAt = investment.CreatedAt,
                UpdatedAt = investment.UpdatedAt
            };
        }
    }
}
