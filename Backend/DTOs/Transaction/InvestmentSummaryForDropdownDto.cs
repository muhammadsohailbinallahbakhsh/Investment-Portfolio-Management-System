namespace Backend.DTOs.Transaction
{
    public class InvestmentSummaryForDropdownDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal CurrentValue { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}