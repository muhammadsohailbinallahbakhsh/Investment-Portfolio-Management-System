export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export enum InvestmentType {
  Stock = 'Stock',
  Bond = 'Bond',
  MutualFund = 'Mutual Fund',
  ETF = 'ETF',
  RealEstate = 'Real Estate',
  Cryptocurrency = 'Cryptocurrency',
  Commodity = 'Commodity',
  Other = 'Other',
}

export enum InvestmentStatus {
  Active = 'Active',
  Sold = 'Sold',
  Closed = 'Closed',
}

export enum TransactionType {
  Buy = 'Buy',
  Sell = 'Sell',
  Dividend = 'Dividend',
  Interest = 'Interest',
}

export enum ActivityAction {
  Created = 'Created',
  Updated = 'Updated',
  Deleted = 'Deleted',
  Viewed = 'Viewed',
  Exported = 'Exported',
  Login = 'Login',
  Logout = 'Logout',
}

export enum EntityType {
  Portfolio = 'Portfolio',
  Investment = 'Investment',
  Transaction = 'Transaction',
  User = 'User',
  Report = 'Report',
}

export enum ExportFormat {
  PDF = 'pdf',
  Excel = 'excel',
  CSV = 'csv',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}
