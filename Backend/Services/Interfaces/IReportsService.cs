using Backend.DTOs.Reports;

namespace Backend.Services.Interfaces
{
    public interface IReportsService
    {
        // ==========================================
        // Report Generation
        // ==========================================

        Task<PerformanceSummaryReport> GeneratePerformanceSummaryReportAsync(
            string userId,
            DateTime? startDate = null,
            DateTime? endDate = null);

        Task<InvestmentDistributionReport> GenerateInvestmentDistributionReportAsync(
            string userId);

        Task<TransactionHistoryReport> GenerateTransactionHistoryReportAsync(
            string userId,
            DateTime? startDate = null,
            DateTime? endDate = null);

        Task<MonthlyPerformanceTrendReport> GenerateMonthlyPerformanceTrendReportAsync(
            string userId,
            int months = 12);

        Task<YearOverYearReport> GenerateYearOverYearReportAsync(
            string userId);

        Task<TopPerformingInvestmentsReport> GenerateTopPerformingInvestmentsReportAsync(
            string userId,
            DateTime? startDate = null,
            DateTime? endDate = null,
            int topCount = 10);

        // ==========================================
        // Export Functions
        // ==========================================

        Task<byte[]> ExportReportToCsvAsync(
            string userId,
            string reportType,
            DateTime? startDate = null,
            DateTime? endDate = null);

        Task<string> ExportReportToJsonAsync(
            string userId,
            string reportType,
            DateTime? startDate = null,
            DateTime? endDate = null);

        Task<object> ExportReportToPdfAsync(
            string userId,
            string reportType,
            DateTime? startDate = null,
            DateTime? endDate = null);

        // ==========================================
        // Helper Methods
        // ==========================================
        (DateTime startDate, DateTime endDate) ParsePresetDateRange(string? presetRange);

        List<string> GetAvailableReportTypes();
    }
}