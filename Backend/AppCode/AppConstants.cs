namespace Backend.AppCode
{
    public static class AppConstants
    {
        public static class UserRole
        {
            public const string Admin = "Admin";
            public const string User = "User";
        }
        public enum InvestmentType
        {
            Stocks, Bonds, RealEstate, Crypto, MutualFunds, Other
        }
        public enum InvestmentStatus
        {
            Active, Sold, OnHold
        }
        public enum TransactionType
        {
            Buy, Sell, Update
        }
        public enum EntityType
        {
            User, Portfolio, Investment, Transaction
        }
        public enum ActivityAction
        {
            Create, Update, Delete, Login, Logout, Export, Seed
        }

    }
}
