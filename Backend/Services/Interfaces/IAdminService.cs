using Backend.DTOs.Admin;

namespace Backend.Services.Interfaces
{
    /// <summary>
    /// Service for admin dashboard and user management operations
    /// </summary>
    public interface IAdminService
    {
        // ==========================================
        // Dashboard Statistics
        // ==========================================

        /// <summary>
        /// Get complete admin dashboard data with statistics and recent activity
        /// </summary>
        Task<AdminDashboardDto> GetDashboardDataAsync();

        /// <summary>
        /// Get system-wide statistics for dashboard cards
        /// </summary>
        Task<SystemStatistics> GetSystemStatisticsAsync();

        /// <summary>
        /// Get recent system activities for dashboard
        /// </summary>
        Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 20);

        /// <summary>
        /// Get recently registered users
        /// </summary>
        Task<List<UserSummaryDto>> GetRecentUsersAsync(int count = 10);

        // ==========================================
        // User Management
        // ==========================================

        /// <summary>
        /// Search and filter users with pagination
        /// </summary>
        Task<(List<UserManagementDto> users, int totalCount)> SearchUsersAsync(UserSearchDto searchDto);

        /// <summary>
        /// Get detailed user information by ID
        /// </summary>
        Task<UserDetailDto?> GetUserDetailAsync(string userId);

        /// <summary>
        /// Activate user account
        /// </summary>
        Task<bool> ActivateUserAsync(string userId);

        /// <summary>
        /// Deactivate user account
        /// </summary>
        Task<bool> DeactivateUserAsync(string userId);

        /// <summary>
        /// Soft delete user account
        /// </summary>
        Task<bool> DeleteUserAsync(string userId);

        /// <summary>
        /// Bulk activate users
        /// </summary>
        Task<int> BulkActivateUsersAsync(List<string> userIds);

        /// <summary>
        /// Bulk deactivate users
        /// </summary>
        Task<int> BulkDeactivateUsersAsync(List<string> userIds);

        /// <summary>
        /// Bulk delete users
        /// </summary>
        Task<int> BulkDeleteUsersAsync(List<string> userIds);

        // ==========================================
        // User Statistics
        // ==========================================

        /// <summary>
        /// Get user statistics by user ID
        /// </summary>
        Task<UserStatistics> GetUserStatisticsAsync(string userId);
    }

    /// <summary>
    /// Detailed user statistics
    /// </summary>
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