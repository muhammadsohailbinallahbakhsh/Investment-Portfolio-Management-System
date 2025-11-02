using Backend.DTOs.Admin;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPortfolioRepository _portfolioRepository;
        private readonly IInvestmentRepository _investmentRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AdminService> _logger;

        public AdminService(
            IUserRepository userRepository,
            IPortfolioRepository portfolioRepository,
            IInvestmentRepository investmentRepository,
            ITransactionRepository transactionRepository,
            IActivityLogRepository activityLogRepository,
            UserManager<ApplicationUser> userManager,
            ILogger<AdminService> logger)
        {
            _userRepository = userRepository;
            _portfolioRepository = portfolioRepository;
            _investmentRepository = investmentRepository;
            _transactionRepository = transactionRepository;
            _activityLogRepository = activityLogRepository;
            _userManager = userManager;
            _logger = logger;
        }

        // ==========================================
        // Dashboard Statistics
        // ==========================================

        public async Task<AdminDashboardDto> GetDashboardDataAsync()
        {
            var statistics = await GetSystemStatisticsAsync();
            var recentActivities = await GetRecentActivitiesAsync(20);
            var recentUsers = await GetRecentUsersAsync(10);

            return new AdminDashboardDto
            {
                Statistics = statistics,
                RecentActivities = recentActivities,
                RecentUsers = recentUsers,
                GeneratedAt = DateTime.UtcNow
            };
        }

        public async Task<SystemStatistics> GetSystemStatisticsAsync()
        {
            // Get all counts
            var totalUsers = await _userRepository.GetTotalCountAsync();
            var totalPortfolios = await _portfolioRepository.GetTotalCountAsync();
            var totalInvestments = await _investmentRepository.GetTotalCountAsync();
            var totalInvestmentsValue = await _investmentRepository.GetTotalValueAsync();
            var activeTransactionsToday = await _transactionRepository.GetTodayCountAsync();
            var totalTransactions = await _transactionRepository.GetTotalCountAsync();

            // Get active/inactive user counts
            var allUsers = await _userRepository.GetAllAsync(1, int.MaxValue);
            var activeUsers = allUsers.Count(u => u.IsActive);
            var inactiveUsers = totalUsers - activeUsers;

            // Get new users this week/month
            var oneWeekAgo = DateTime.UtcNow.AddDays(-7);
            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
            var newUsersThisWeek = allUsers.Count(u => u.CreatedAt >= oneWeekAgo);
            var newUsersThisMonth = allUsers.Count(u => u.CreatedAt >= oneMonthAgo);

            // Calculate transaction volume today
            var todayTransactions = await _transactionRepository.GetAllAsync(1, int.MaxValue);
            var today = DateTime.UtcNow.Date;
            var transactionVolumeToday = todayTransactions
                .Where(t => t.TransactionDate.Date == today)
                .Sum(t => t.Amount);

            return new SystemStatistics
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                InactiveUsers = inactiveUsers,
                TotalPortfolios = totalPortfolios,
                TotalInvestmentsValue = totalInvestmentsValue,
                TotalInvestments = totalInvestments,
                ActiveTransactionsToday = activeTransactionsToday,
                TotalTransactionsToday = activeTransactionsToday,
                TransactionVolumeToday = transactionVolumeToday,
                TotalTransactions = totalTransactions,
                NewUsersThisWeek = newUsersThisWeek,
                NewUsersThisMonth = newUsersThisMonth,
                InvestmentGrowthPercentage = 0 
            };
        }

        public async Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 20)
        {
            var activities = await _activityLogRepository.GetRecentAsync(count);

            return activities.Select(a => new RecentActivityDto
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = a.User != null ? $"{a.User.FirstName} {a.User.LastName}" : "Unknown",
                UserEmail = a.User?.Email ?? "Unknown",
                Action = a.Action.ToString(),
                EntityType = a.EntityType.ToString(),
                EntityId = a.EntityId,
                Details = a.Details,
                CreatedAt = a.CreatedAt,
                TimeAgo = GetTimeAgo(a.CreatedAt)
            }).ToList();
        }

        public async Task<List<UserSummaryDto>> GetRecentUsersAsync(int count = 10)
        {
            var users = await _userRepository.GetAllAsync(1, count);

            var userSummaries = new List<UserSummaryDto>();

            foreach (var user in users)
            {
                var portfolioCount = await _portfolioRepository.GetCountByUserIdAsync(user.Id);
                var investmentCount = await _investmentRepository.GetCountByUserIdAsync(user.Id);
                var totalValue = await _investmentRepository.GetTotalValueByUserIdAsync(user.Id);

                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault() ?? "User";

                userSummaries.Add(new UserSummaryDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = role,
                    IsActive = user.IsActive,
                    PortfolioCount = portfolioCount,
                    InvestmentCount = investmentCount,
                    TotalInvestmentValue = totalValue,
                    CreatedAt = user.CreatedAt,
                    MemberSince = GetTimeAgo(user.CreatedAt)
                });
            }

            return userSummaries;
        }

        // ==========================================
        // User Management
        // ==========================================

        public async Task<(List<UserManagementDto> users, int totalCount)> SearchUsersAsync(UserSearchDto searchDto)
        {
            // Get all users (we'll filter in-memory for simplicity, but ideally should be in repository)
            var allUsers = await _userRepository.GetAllAsync(1, int.MaxValue);
            var query = allUsers.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchDto.SearchTerm))
            {
                var searchLower = searchDto.SearchTerm.ToLower();
                query = query.Where(u =>
                    (u.Email != null && u.Email.ToLower().Contains(searchLower)) ||
                    u.FirstName.ToLower().Contains(searchLower) ||
                    u.LastName.ToLower().Contains(searchLower));
            }

            // Apply active status filter
            if (searchDto.IsActive.HasValue)
            {
                query = query.Where(u => u.IsActive == searchDto.IsActive.Value);
            }

            // Apply role filter
            if (!string.IsNullOrWhiteSpace(searchDto.Role))
            {
                // This requires UserManager, so we'll do it separately
                var filteredUserIds = new List<string>();
                foreach (var user in query.ToList())
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    if (roles.Any(r => r.Equals(searchDto.Role, StringComparison.OrdinalIgnoreCase)))
                    {
                        filteredUserIds.Add(user.Id);
                    }
                }
                query = query.Where(u => filteredUserIds.Contains(u.Id));
            }

            // Apply date filters
            if (searchDto.RegisteredAfter.HasValue)
            {
                query = query.Where(u => u.CreatedAt >= searchDto.RegisteredAfter.Value);
            }
            if (searchDto.RegisteredBefore.HasValue)
            {
                query = query.Where(u => u.CreatedAt <= searchDto.RegisteredBefore.Value);
            }

            var users = query.ToList();

            // Build user management DTOs
            var userManagementDtos = new List<UserManagementDto>();

            foreach (var user in users)
            {
                var portfolioCount = await _portfolioRepository.GetCountByUserIdAsync(user.Id);
                var investmentCount = await _investmentRepository.GetCountByUserIdAsync(user.Id);
                var totalValue = await _investmentRepository.GetTotalValueByUserIdAsync(user.Id);

                var investments = await _investmentRepository.GetByUserIdAsync(user.Id, 1, int.MaxValue);
                var totalInvested = investments.Sum(i => i.InitialAmount);
                var totalGainLoss = totalValue - totalInvested;

                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault() ?? "User";

                userManagementDtos.Add(new UserManagementDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = role,
                    IsActive = user.IsActive,
                    IsDeleted = user.IsDeleted,
                    EmailConfirmed = user.EmailConfirmed,
                    PortfolioCount = portfolioCount,
                    InvestmentCount = investmentCount,
                    TotalInvestmentValue = totalValue,
                    TotalGainLoss = totalGainLoss,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                });
            }

            // Apply sorting
            userManagementDtos = ApplySorting(userManagementDtos, searchDto.SortBy, searchDto.SortOrder);

            var totalCount = userManagementDtos.Count;

            // Apply pagination
            var paginatedList = userManagementDtos
                .Skip((searchDto.Page - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .ToList();

            return (paginatedList, totalCount);
        }

        public async Task<UserDetailDto?> GetUserDetailAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "User";

            // Get portfolios
            var portfolios = await _portfolioRepository.GetByUserIdAsync(userId);
            var portfolioSummaries = portfolios.Select(p => new PortfolioSummary
            {
                Id = p.Id,
                Name = p.Name,
                InvestmentCount = p.Investments.Count(i => !i.IsDeleted),
                TotalValue = p.Investments.Where(i => !i.IsDeleted).Sum(i => i.CurrentValue),
                CreatedAt = p.CreatedAt
            }).ToList();

            // Get investments
            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var totalInvested = investments.Sum(i => i.InitialAmount);
            var currentValue = investments.Sum(i => i.CurrentValue);
            var totalGainLoss = currentValue - totalInvested;
            var gainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

            // Get transactions
            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var lastTransaction = transactions.OrderByDescending(t => t.TransactionDate).FirstOrDefault();

            // Get recent activities
            var activities = await _activityLogRepository.GetByUserIdAsync(userId, 1, 10);
            var recentActivities = activities.Select(a => new RecentActivityDto
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = $"{user.FirstName} {user.LastName}",
                UserEmail = user.Email ?? string.Empty,
                Action = a.Action.ToString(),
                EntityType = a.EntityType.ToString(),
                EntityId = a.EntityId,
                Details = a.Details,
                CreatedAt = a.CreatedAt,
                TimeAgo = GetTimeAgo(a.CreatedAt)
            }).ToList();

            return new UserDetailDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = role,
                IsActive = user.IsActive,
                IsDeleted = user.IsDeleted,
                EmailConfirmed = user.EmailConfirmed,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                Portfolios = portfolioSummaries,
                TotalInvestments = investments.Count(),
                TotalInvested = totalInvested,
                CurrentValue = currentValue,
                TotalGainLoss = totalGainLoss,
                GainLossPercentage = gainLossPercentage,
                TotalTransactions = transactions.Count(),
                LastTransactionDate = lastTransaction?.TransactionDate,
                RecentActivities = recentActivities
            };
        }

        public async Task<bool> ActivateUserAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            if (user.IsActive) return true; // Already active

            user.IsActive = true;
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> DeactivateUserAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            if (!user.IsActive) return true; // Already inactive

            user.IsActive = false;
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            return await _userRepository.SoftDeleteAsync(userId);
        }

        public async Task<int> BulkActivateUsersAsync(List<string> userIds)
        {
            int count = 0;
            foreach (var userId in userIds)
            {
                if (await ActivateUserAsync(userId))
                    count++;
            }
            return count;
        }

        public async Task<int> BulkDeactivateUsersAsync(List<string> userIds)
        {
            int count = 0;
            foreach (var userId in userIds)
            {
                if (await DeactivateUserAsync(userId))
                    count++;
            }
            return count;
        }

        public async Task<int> BulkDeleteUsersAsync(List<string> userIds)
        {
            int count = 0;
            foreach (var userId in userIds)
            {
                if (await DeleteUserAsync(userId))
                    count++;
            }
            return count;
        }

        public async Task<UserStatistics> GetUserStatisticsAsync(string userId)
        {
            var portfolioCount = await _portfolioRepository.GetCountByUserIdAsync(userId);
            var investmentCount = await _investmentRepository.GetCountByUserIdAsync(userId);
            var totalValue = await _investmentRepository.GetTotalValueByUserIdAsync(userId);

            var investments = await _investmentRepository.GetByUserIdAsync(userId, 1, int.MaxValue);
            var totalInvested = investments.Sum(i => i.InitialAmount);
            var totalGainLoss = totalValue - totalInvested;
            var gainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

            var transactions = await _transactionRepository.GetRecentByUserIdAsync(userId, int.MaxValue);
            var lastTransaction = transactions.OrderByDescending(t => t.TransactionDate).FirstOrDefault();

            return new UserStatistics
            {
                PortfolioCount = portfolioCount,
                InvestmentCount = investmentCount,
                TransactionCount = transactions.Count(),
                TotalInvested = totalInvested,
                CurrentValue = totalValue,
                TotalGainLoss = totalGainLoss,
                GainLossPercentage = gainLossPercentage,
                LastTransactionDate = lastTransaction?.TransactionDate
            };
        }

        // ==========================================
        // Helper Methods
        // ==========================================

        private List<UserManagementDto> ApplySorting(
            List<UserManagementDto> users,
            string? sortBy,
            string? sortOrder)
        {
            var isDescending = sortOrder?.ToLower() == "desc";

            return sortBy?.ToLower() switch
            {
                "email" => isDescending
                    ? users.OrderByDescending(u => u.Email).ToList()
                    : users.OrderBy(u => u.Email).ToList(),

                "lastname" => isDescending
                    ? users.OrderByDescending(u => u.LastName).ToList()
                    : users.OrderBy(u => u.LastName).ToList(),

                "investmentvalue" => isDescending
                    ? users.OrderByDescending(u => u.TotalInvestmentValue).ToList()
                    : users.OrderBy(u => u.TotalInvestmentValue).ToList(),

                "createdat" => isDescending
                    ? users.OrderByDescending(u => u.CreatedAt).ToList()
                    : users.OrderBy(u => u.CreatedAt).ToList(),

                _ => users.OrderByDescending(u => u.CreatedAt).ToList()
            };
        }

        private string GetTimeAgo(DateTime date)
        {
            var timeSpan = DateTime.UtcNow - date;

            if (timeSpan.TotalMinutes < 1)
                return "just now";
            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes} minute{((int)timeSpan.TotalMinutes != 1 ? "s" : "")} ago";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours} hour{((int)timeSpan.TotalHours != 1 ? "s" : "")} ago";
            if (timeSpan.TotalDays < 30)
                return $"{(int)timeSpan.TotalDays} day{((int)timeSpan.TotalDays != 1 ? "s" : "")} ago";
            if (timeSpan.TotalDays < 365)
                return $"{(int)(timeSpan.TotalDays / 30)} month{((int)(timeSpan.TotalDays / 30) != 1 ? "s" : "")} ago";

            return $"{(int)(timeSpan.TotalDays / 365)} year{((int)(timeSpan.TotalDays / 365) != 1 ? "s" : "")} ago";
        }
    }
}