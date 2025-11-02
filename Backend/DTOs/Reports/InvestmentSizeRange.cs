namespace Backend.DTOs.Reports
{
    public class InvestmentSizeRange
    {
        public string Range { get; set; } = string.Empty; // "< $1,000", "$1,000 - $5,000", etc.
        public int Count { get; set; }
        public decimal TotalValue { get; set; }
    }
}
