namespace Backend.DTOs.Dashboard
{
    public class PortfolioBreakdown
    {
        public int ActiveInvestments { get; set; }
        public int SoldInvestments { get; set; }
        public int OnHoldInvestments { get; set; }
        public decimal ActiveValue { get; set; }
        public decimal SoldValue { get; set; }
        public decimal OnHoldValue { get; set; }
    }
}
