using Backend.DTOs.Admin;

namespace Backend.Services.Interfaces
{
    public interface IAdminService
    {
        // ==========================================
        // Dashboard Statistics
        // ==========================================
        Task<AdminDashboardDto> GetDashboardDataAsync();

        Task<SystemStatistics> GetSystemStatisticsAsync();

        Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 20);

        Task<List<UserSummaryDto>> GetRecentUsersAsync(int count = 10);

        // ==========================================
        // User Management
        // ==========================================
        Task<(List<UserManagementDto> users, int totalCount)> SearchUsersAsync(UserSearchDto searchDto);

        Task<UserDetailDto?> GetUserDetailAsync(string userId);

        Task<bool> ActivateUserAsync(string userId);

        Task<bool> DeactivateUserAsync(string userId);

        Task<bool> DeleteUserAsync(string userId);

        Task<int> BulkActivateUsersAsync(List<string> userIds);

        Task<int> BulkDeactivateUsersAsync(List<string> userIds);

        Task<int> BulkDeleteUsersAsync(List<string> userIds);

        // ==========================================
        // User Statistics
        // ==========================================

        Task<UserStatistics> GetUserStatisticsAsync(string userId);
    }

    public class UserStatistics
    {
        public int PortfolioCount { get; set; }
        public int InvestmentCount { get; set; }
        public int TransactionCount { get; set; }
        public decimal TotalInvested { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal GainLossPercentage { get; set; }
        public DateTime? LastTransactionDate { get; set; }
    }
}