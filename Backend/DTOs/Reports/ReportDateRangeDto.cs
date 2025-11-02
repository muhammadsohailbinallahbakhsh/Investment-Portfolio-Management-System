namespace Backend.DTOs.Reports
{
    public class ReportDateRangeDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        // Predefined ranges
        public string? PresetRange { get; set; } // "last7days", "last30days", "last3months", "last6months", "last12months", "thisYear", "lastYear", "allTime"
    }
}
