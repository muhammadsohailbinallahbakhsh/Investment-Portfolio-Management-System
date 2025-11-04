// ============================================
// Common API Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================
// Portfolio Types
// ============================================

export interface Portfolio {
  id: number;
  userId: string;
  name: string;
  description?: string;
  totalInvested: number;
  currentValue: number;
  totalInvestments: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PortfolioDetail extends Portfolio {
  investments: Investment[];
  performanceMetrics: {
    totalGainLoss: number;
    totalGainLossPercentage: number;
    topPerformer?: Investment;
    worstPerformer?: Investment;
  };
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
}

export interface UpdatePortfolioRequest {
  name?: string;
  description?: string;
}

export interface PortfolioSummary {
  id: number;
  name: string;
  totalValue: number;
  totalInvestments: number;
}

// ============================================
// Investment Types
// ============================================

export interface Investment {
  id: number;
  userId: string;
  portfolioId?: number;
  portfolioName?: string;
  name: string;
  type: string;
  initialAmount: number;
  currentValue: number;
  quantity?: number;
  averagePricePerUnit?: number;
  gainLoss: number;
  gainLossPercentage: number;
  purchaseDate: string;
  brokerPlatform?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InvestmentDetail extends Investment {
  transactions: Transaction[];
  performanceHistory?: PerformanceDataPoint[];
}

export interface CreateInvestmentRequest {
  portfolioId?: number;
  name: string;
  type: string;
  initialAmount: number;
  currentValue: number;
  quantity?: number;
  purchaseDate: string;
  brokerPlatform?: string;
  notes?: string;
}

export interface UpdateInvestmentRequest {
  portfolioId?: number;
  name?: string;
  type?: string;
  currentValue?: number;
  quantity?: number;
  brokerPlatform?: string;
  notes?: string;
  status?: string;
}

export interface InvestmentFilterParams extends PaginationParams {
  portfolioId?: number;
  type?: string;
  status?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkDeleteRequest {
  ids: number[];
}

export interface InvestmentSummary {
  id: number;
  name: string;
  type: string;
  currentValue: number;
}

// ============================================
// Transaction Types
// ============================================

export interface Transaction {
  id: number;
  investmentId: number;
  investmentName: string;
  investmentType: string;
  type: string;
  quantity: number;
  pricePerUnit: number;
  amount: number;
  transactionDate: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTransactionRequest {
  investmentId: number;
  type: string;
  quantity: number;
  pricePerUnit: number;
  transactionDate: string;
  notes?: string;
}

export interface UpdateTransactionRequest {
  type?: string;
  quantity?: number;
  pricePerUnit?: number;
  transactionDate?: string;
  notes?: string;
}

export interface TransactionFilterParams extends PaginationParams {
  investmentId?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionPreview {
  investmentId: number;
  type: string;
  quantity: number;
  pricePerUnit: number;
}

export interface TransactionPreviewResult {
  newAveragePrice: number;
  newTotalQuantity: number;
  newCurrentValue: number;
  impactOnGainLoss: number;
  message: string;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  totalPortfolios: number;
  totalInvestments: number;
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  recentTransactions: Transaction[];
  topPerformingInvestments: Investment[];
  portfolioDistribution: DistributionItem[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalActiveUsers: number;
  totalPortfolios: number;
  totalInvestments: number;
  totalTransactions: number;
  systemValue: number;
  recentUsers: User[];
  userGrowthData: ChartDataPoint[];
}

// ============================================
// Report Types
// ============================================

export interface ReportDateRange {
  startDate: string;
  endDate: string;
}

export interface PerformanceSummaryReport {
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  numberOfInvestments: number;
  numberOfPortfolios: number;
  bestPerformingInvestment?: TopInvestmentItem;
  worstPerformingInvestment?: TopInvestmentItem;
  investmentsByType: DistributionItem[];
  performanceOverTime: PerformanceDataPoint[];
}

export interface InvestmentDistributionReport {
  byType: DistributionItem[];
  byPortfolio: DistributionItem[];
  byStatus: DistributionItem[];
  topInvestments: TopInvestmentItem[];
}

export interface TransactionHistoryReport {
  totalTransactions: number;
  totalBuyAmount: number;
  totalSellAmount: number;
  transactionsByType: TransactionsByTypeItem[];
  transactionsByMonth: TransactionsByMonthItem[];
  recentTransactions: TransactionDetailItem[];
}

export interface DistributionItem {
  name: string;
  value: number;
  percentage: number;
  count?: number;
}

export interface TopInvestmentItem {
  id: number;
  name: string;
  type: string;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
  gainLoss?: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TransactionsByTypeItem {
  type: string;
  count: number;
  totalAmount: number;
}

export interface TransactionsByMonthItem {
  month: string;
  buyCount: number;
  sellCount: number;
  buyAmount: number;
  sellAmount: number;
}

export interface TransactionDetailItem {
  id: number;
  investmentName: string;
  type: string;
  amount: number;
  date: string;
}

export interface ExportReportRequest {
  reportType: string;
  format: 'pdf' | 'excel' | 'csv';
  dateRange?: ReportDateRange;
}

// ============================================
// Activity Log Types
// ============================================

export interface ActivityLog {
  id: number;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: number;
  details?: string;
  timestamp: string;
}

export interface ActivityLogFilterParams extends PaginationParams {
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================
// Legacy Types (for backward compatibility)
// ============================================

export type SignUpRequest = RegisterRequest;
export type SignUpResponse = AuthResponse;
