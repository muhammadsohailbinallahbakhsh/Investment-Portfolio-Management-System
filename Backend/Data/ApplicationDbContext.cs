using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Portfolio> Portfolios { get; set; } = null!;
        public DbSet<Investment> Investments { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; } = null!;
        public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ------------------------------
            // ApplicationUser Configuration
            // ------------------------------
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.HasQueryFilter(u => !u.IsDeleted);

                entity.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(u => u.LastName).IsRequired().HasMaxLength(100);
                entity.Property(u => u.IsActive).HasDefaultValue(true);
                entity.Property(u => u.IsDeleted).HasDefaultValue(false);
                entity.Property(u => u.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // ------------------------------
            // Portfolio Configuration
            // ------------------------------
            builder.Entity<Portfolio>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.HasQueryFilter(p => !p.IsDeleted);

                entity.Property(p => p.Name).IsRequired().HasMaxLength(100);
                entity.Property(p => p.Description).HasMaxLength(500);
                entity.Property(p => p.IsDeleted).HasDefaultValue(false);
                entity.Property(p => p.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(p => p.User)
                    .WithMany(u => u.Portfolios)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(p => p.UserId);
            });

            // ------------------------------
            // Investment Configuration
            // ------------------------------
            builder.Entity<Investment>(entity =>
            {
                entity.HasKey(i => i.Id);
                entity.HasQueryFilter(i => !i.IsDeleted);

                entity.Property(i => i.Name).IsRequired().HasMaxLength(200);
                entity.Property(i => i.Type).HasConversion<string>().HasMaxLength(50);
                entity.Property(i => i.Status).HasConversion<string>().HasMaxLength(50);

                entity.Property(i => i.InitialAmount).HasColumnType("decimal(18,4)");
                entity.Property(i => i.CurrentValue).HasColumnType("decimal(18,4)");
                entity.Property(i => i.Quantity).HasColumnType("decimal(18,8)");
                entity.Property(i => i.AveragePricePerUnit).HasColumnType("decimal(18,8)");

                entity.Property(i => i.BrokerPlatform).HasMaxLength(100);
                entity.Property(i => i.Notes).HasMaxLength(1000);
                entity.Property(i => i.IsDeleted).HasDefaultValue(false);
                entity.Property(i => i.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.Property(i => i.RowVersion).IsRowVersion();

                entity.HasOne(i => i.User)
                    .WithMany(u => u.Investments)
                    .HasForeignKey(i => i.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(i => i.Portfolio)
                    .WithMany(p => p.Investments)
                    .HasForeignKey(i => i.PortfolioId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(i => i.UserId);
                entity.HasIndex(i => i.PortfolioId);
                entity.HasIndex(i => i.Type);
                entity.HasIndex(i => i.Status);
            });

            // ------------------------------
            // Transaction Configuration
            // ------------------------------
            builder.Entity<Transaction>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.HasQueryFilter(t => !t.IsDeleted);

                entity.Property(t => t.Type).HasConversion<string>().HasMaxLength(50);
                entity.Property(t => t.Quantity).HasColumnType("decimal(18,8)");
                entity.Property(t => t.PricePerUnit).HasColumnType("decimal(18,8)");
                entity.Property(t => t.Amount).HasColumnType("decimal(18,4)");
                entity.Property(t => t.Notes).HasMaxLength(500);
                entity.Property(t => t.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(t => t.Investment)
                    .WithMany(i => i.Transactions)
                    .HasForeignKey(t => t.InvestmentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(t => t.InvestmentId);
                entity.HasIndex(t => t.TransactionDate);
            });

            // ------------------------------
            // ActivityLog Configuration
            // ------------------------------
            builder.Entity<ActivityLog>(entity =>
            {
                entity.HasKey(a => a.Id);

                entity.Property(a => a.Action).IsRequired().HasMaxLength(100);
                entity.Property(a => a.EntityType).IsRequired().HasMaxLength(50);
                entity.Property(a => a.EntityId).HasMaxLength(50);
                entity.Property(a => a.Details).HasMaxLength(1000);
                entity.Property(a => a.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(a => a.User)
                    .WithMany()
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);

                entity.HasIndex(a => a.UserId);
                entity.HasIndex(a => a.CreatedAt);
            });
        }
    }
}
