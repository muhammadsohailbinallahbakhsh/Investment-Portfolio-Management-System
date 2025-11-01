using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static Backend.AppCode.AppConstants;

namespace Backend.Data
{
    public class Seeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public Seeder(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            await SeedRolesAsync();
            var users = await SeedUsersAsync();
            await SeedPortfoliosAsync(users);
            await _context.SaveChangesAsync();
        }

        // ------------------------------
        // 1. Roles
        // ------------------------------
        private async Task SeedRolesAsync()
        {
            string[] roles = { "Admin", "User" };

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                    await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // ------------------------------
        // 2. Users
        // ------------------------------
        private async Task<List<ApplicationUser>> SeedUsersAsync()
        {
            var users = new List<ApplicationUser>();

            // Admin
            var admin = await _userManager.FindByEmailAsync("admin@portfolio.com");
            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    UserName = "admin@portfolio.com",
                    Email = "admin@portfolio.com",
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(admin, "Admin@123");
                if (result.Succeeded)
                    await _userManager.AddToRoleAsync(admin, "Admin");
            }

            // User 1
            users.Add(await CreateUserIfNotExistsAsync("user1@portfolio.com", "John", "Doe"));
            // User 2
            users.Add(await CreateUserIfNotExistsAsync("user2@portfolio.com", "Jane", "Smith"));

            return users;
        }

        private async Task<ApplicationUser> CreateUserIfNotExistsAsync(string email, string firstName, string lastName)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    EmailConfirmed = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, "User@123");
                if (result.Succeeded)
                    await _userManager.AddToRoleAsync(user, "User");
            }
            return user;
        }

        // ------------------------------
        // 3. Portfolios
        // ------------------------------
        private async Task SeedPortfoliosAsync(List<ApplicationUser> users)
        {
            if (await _context.Portfolios.AnyAsync()) return;

            foreach (var user in users)
            {
                var defaultPortfolio = new Portfolio
                {
                    UserId = user.Id,
                    Name = "Default Portfolio",
                    Description = "Automatically created portfolio",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Portfolios.Add(defaultPortfolio);
                await _context.SaveChangesAsync();

                await SeedInvestmentsAsync(user, defaultPortfolio);
            }
        }

        // ------------------------------
        // 4. Investments
        // ------------------------------
        private async Task SeedInvestmentsAsync(ApplicationUser user, Portfolio portfolio)
        {
            var random = new Random();
            var investments = new List<Investment>();

            var types = Enum.GetValues(typeof(InvestmentType)).Cast<InvestmentType>().ToArray();
            var statuses = Enum.GetValues(typeof(InvestmentStatus)).Cast<InvestmentStatus>().ToArray();

            string[] stockNames = { "Apple", "Microsoft", "Tesla", "Amazon", "NVIDIA" };
            string[] brokers = { "Robinhood", "E*TRADE", "Fidelity", "Charles Schwab" };

            for (int i = 0; i < 8; i++)
            {
                var type = types[random.Next(types.Length)];
                var status = statuses[random.Next(statuses.Length)];
                var name = $"{stockNames[random.Next(stockNames.Length)]} {i + 1}";

                var initialAmount = random.Next(1000, 10000);
                var quantity = Math.Round((decimal)random.NextDouble() * 10 + 1, 4);
                var avgPrice = Math.Round(initialAmount / quantity, 2);
                var currentValue = Math.Round(initialAmount * (decimal)(1 + (random.NextDouble() * 0.4 - 0.2)), 2);

                var investment = new Investment
                {
                    UserId = user.Id,
                    PortfolioId = portfolio.Id,
                    Name = name,
                    Type = type,
                    Status = status,
                    InitialAmount = initialAmount,
                    Quantity = quantity,
                    AveragePricePerUnit = avgPrice,
                    CurrentValue = currentValue,
                    PurchaseDate = DateTime.UtcNow.AddDays(-random.Next(30, 365)),
                    BrokerPlatform = brokers[random.Next(brokers.Length)],
                    Notes = $"Investment in {name}",
                    CreatedAt = DateTime.UtcNow
                };

                investments.Add(investment);
            }

            _context.Investments.AddRange(investments);
            await _context.SaveChangesAsync();

            await SeedTransactionsAsync(investments);
        }

        // ------------------------------
        // 5. Transactions
        // ------------------------------
        private async Task SeedTransactionsAsync(List<Investment> investments)
        {
            if (await _context.Transactions.AnyAsync()) return;

            var random = new Random();
            var transactions = new List<Transaction>();

            foreach (var inv in investments)
            {
                var transactionCount = random.Next(2, 6);

                for (int i = 0; i < transactionCount; i++)
                {
                    var type = (TransactionType)random.Next(0, 3);
                    var qty = Math.Round((decimal)random.NextDouble() * 3 + 1, 4);
                    var price = Math.Round((decimal)random.Next(50, 500), 2);
                    var amount = Math.Round(qty * price, 2);

                    var transaction = new Transaction
                    {
                        InvestmentId = inv.Id,
                        Type = type,
                        Quantity = qty,
                        PricePerUnit = price,
                        Amount = amount,
                        TransactionDate = inv.PurchaseDate.AddDays(random.Next(1, 200)),
                        Notes = $"{type} transaction for {inv.Name}",
                        CreatedAt = DateTime.UtcNow
                    };

                    transactions.Add(transaction);
                }
            }

            _context.Transactions.AddRange(transactions);
            await _context.SaveChangesAsync();
        }
    }
}
