using Backend.DTOs.Portfolio;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class PortfolioService : IPortfolioService
    {
        private readonly IPortfolioRepository _portfolioRepository;

        public PortfolioService(IPortfolioRepository portfolioRepository)
        {
            _portfolioRepository = portfolioRepository;
        }

        public async Task<PortfolioDto?> GetByIdAsync(int id)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);
            return portfolio != null ? MapToDto(portfolio) : null;
        }

        public async Task<IEnumerable<PortfolioDto>> GetByUserIdAsync(string userId)
        {
            var portfolios = await _portfolioRepository.GetByUserIdAsync(userId);
            return portfolios.Select(MapToDto);
        }

        public async Task<IEnumerable<PortfolioDto>> GetAllAsync(int page, int pageSize)
        {
            var portfolios = await _portfolioRepository.GetAllAsync(page, pageSize);
            return portfolios.Select(MapToDto);
        }

        public async Task<int> GetTotalCountAsync() => await _portfolioRepository.GetTotalCountAsync();
        public async Task<int> GetCountByUserIdAsync(string userId) => await _portfolioRepository.GetCountByUserIdAsync(userId);

        public async Task<PortfolioDto> CreateAsync(string userId, CreatePortfolioDto createDto)
        {
            var portfolio = new Portfolio
            {
                UserId = userId,
                Name = createDto.Name,
                Description = createDto.Description
            };

            var created = await _portfolioRepository.CreateAsync(portfolio);
            return MapToDto(created);
        }

        public async Task<bool> UpdateAsync(int id, string userId, UpdatePortfolioDto updateDto)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);
            if (portfolio == null || portfolio.UserId != userId)
                return false;

            portfolio.Name = updateDto.Name;
            portfolio.Description = updateDto.Description;
            return await _portfolioRepository.UpdateAsync(portfolio);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var portfolio = await _portfolioRepository.GetByIdAsync(id);
            if (portfolio == null || portfolio.UserId != userId)
                return false;

            return await _portfolioRepository.SoftDeleteAsync(id);
        }

        private static PortfolioDto MapToDto(Portfolio p)
        {
            return new PortfolioDto
            {
                Id = p.Id,
                UserId = p.UserId,
                Name = p.Name,
                Description = p.Description,
                TotalInvested = p.Investments.Sum(i => i.InitialAmount),
                CurrentValue = p.Investments.Sum(i => i.CurrentValue),
                TotalInvestments = p.Investments.Count,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            };
        }
    }
}
