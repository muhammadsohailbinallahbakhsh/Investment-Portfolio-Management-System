using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<ApplicationUser?> GetByIdAsync(string id);
        Task<ApplicationUser?> GetByEmailAsync(string email);
        Task<IEnumerable<ApplicationUser>> GetAllAsync(int page, int pageSize);
        Task<int> GetTotalCountAsync();

        Task<bool> UpdateAsync(ApplicationUser user);
        Task<bool> SoftDeleteAsync(string id);
        Task<bool> ToggleActiveStatusAsync(string id);
    }
}
