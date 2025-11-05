using Microsoft.AspNetCore.Identity;
using Backend.DTOs.User;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(IUserRepository userRepository, UserManager<ApplicationUser> userManager)
        {
            _userRepository = userRepository;
            _userManager = userManager;
        }

        public async Task<UserDto?> GetByIdAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            return MapToDto(user, roles.FirstOrDefault() ?? "User");
        }

        public async Task<UserDto?> GetByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            return MapToDto(user, roles.FirstOrDefault() ?? "User");
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync(int page, int pageSize)
        {
            var users = await _userRepository.GetAllAsync(page, pageSize);
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(MapToDto(user, roles.FirstOrDefault() ?? "User"));
            }

            return userDtos;
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _userRepository.GetTotalCountAsync();
        }

        public async Task<UserDto?> UpdateAsync(string id, UpdateUserDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return null;

            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;

            // Update email and username using UserManager to ensure proper normalization
            if (!string.IsNullOrWhiteSpace(updateUserDto.Email) && user.Email != updateUserDto.Email)
            {
                // Set email (this also sets NormalizedEmail)
                var emailResult = await _userManager.SetEmailAsync(user, updateUserDto.Email);
                if (!emailResult.Succeeded)
                {
                    return null;
                }

                // Set username to match email (this also sets NormalizedUserName)
                var usernameResult = await _userManager.SetUserNameAsync(user, updateUserDto.Email);
                if (!usernameResult.Succeeded)
                {
                    return null;
                }
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return null;
            }

            // Return the updated user data
            var roles = await _userManager.GetRolesAsync(user);
            return MapToDto(user, roles.FirstOrDefault() ?? "User");
        }

        public async Task<bool> DeleteAsync(string id)
        {
            return await _userRepository.SoftDeleteAsync(id);
        }

        public async Task<bool> ToggleActiveStatusAsync(string id)
        {
            return await _userRepository.ToggleActiveStatusAsync(id);
        }

        private UserDto MapToDto(ApplicationUser user, string role)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}