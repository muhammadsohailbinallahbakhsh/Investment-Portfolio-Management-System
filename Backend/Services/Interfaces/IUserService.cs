using Backend.DTOs.User;

namespace Backend.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetByIdAsync(string id);
        Task<UserDto?> GetByEmailAsync(string email);
        Task<IEnumerable<UserDto>> GetAllAsync(int page, int pageSize);
        Task<int> GetTotalCountAsync();
        Task<bool> UpdateAsync(string id, UpdateUserDto updateUserDto);
        Task<bool> DeleteAsync(string id);
        Task<bool> ToggleActiveStatusAsync(string id);
    }
}
