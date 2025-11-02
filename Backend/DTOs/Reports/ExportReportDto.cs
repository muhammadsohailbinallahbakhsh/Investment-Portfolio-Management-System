using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Reports
{
    public class ExportReportDto
    {
        [Required]
        public string ReportType { get; set; } = string.Empty; // "performance", "distribution", "transactions", "monthly", "yearOverYear", "topPerforming"

        [Required]
        public ExportFormat Format { get; set; } = ExportFormat.CSV;

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? PresetRange { get; set; }
    }
}
