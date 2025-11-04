const APP_NAME = 'Investment Portfolio Management System';
const APP_SHORT_NAME = 'IPMS';

// Investment Types (matching backend enum)
export const INVESTMENT_TYPES = [
  'Stocks',
  'Bonds',
  'RealEstate',
  'Crypto',
  'MutualFunds',
  'Other',
] as const;

// Investment Statuses (matching backend enum)
export const INVESTMENT_STATUSES = ['Active', 'Sold', 'OnHold'] as const;

// Transaction Types (matching backend enum)
export const TRANSACTION_TYPES = ['Buy', 'Sell', 'Update'] as const;
