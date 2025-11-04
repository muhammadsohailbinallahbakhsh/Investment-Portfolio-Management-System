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
  success: boolean;
  message: string;
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
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
  isDefault: boolean;
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
  isDefault: boolean;
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
  portfolioId: number;
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
  name: string;
  type: string;
  initialAmount: number;
  quantity?: number;
  averagePricePerUnit?: number;
  purchaseDate: string;
  brokerPlatform?: string;
  notes?: string;
  status: string;
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
  investmentName: string;
  currentValue: number;
  transactionAmount: number;
  newTotalValue: number;
  valueChange: number;
  valueChangePercentage: number;
  isValid: boolean;
  validationMessage?: string;
  newQuantity?: number;
  newAveragePricePerUnit?: number;
}

// ============================================
// Dashboard Types
// ============================================

export interface InvestmentPerformanceCard {
  id: number;
  name: string;
  type: string;
  currentValue: number;
  initialAmount: number;
  gainLoss: number;
  gainLossPercentage: number;
  status: string;
  purchaseDate: string;
}

export interface PortfolioSummaryCards {
  totalInvestmentValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  numberOfActiveInvestments: number;
  totalInvestments: number;
  bestPerforming?: InvestmentPerformanceCard;
  worstPerforming?: InvestmentPerformanceCard;
  totalTransactions: number;
  lastTransactionDate?: string;
  portfolioCount: number;
}

export interface RecentTransactionDto {
  id: number;
  investmentName: string;
  type: string;
  amount: number;
  date: string;
  description?: string;
}

export interface PerformanceChartData {
  labels: string[];
  values: number[];
}

export interface AssetAllocationData {
  labels: string[];
  values: number[];
}

export interface UserDashboardDto {
  summaryCards: PortfolioSummaryCards;
  recentTransactions: RecentTransactionDto[];
  performanceChart: PerformanceChartData;
  assetAllocation: AssetAllocationData;
  generatedAt: string;
}

// Legacy type (kept for backward compatibility)
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
  startDate?: string;
  endDate?: string;
  presetRange?: string;
}

export interface PerformanceSummaryReport {
  reportTitle: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;

  // Overall Performance
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;

  // Investment Breakdown
  totalInvestments: number;
  activeInvestments: number;
  soldInvestments: number;
  onHoldInvestments: number;

  // Transaction Summary
  totalTransactions: number;
  totalBuyVolume: number;
  totalSellVolume: number;

  // Top Performers
  topPerformers: TopPerformerItem[];
  worstPerformers: TopPerformerItem[];

  // Performance by Type
  performanceByType: PerformanceByTypeItem[];

  // Monthly Trend
  monthlyTrend: MonthlyTrendItem[];
}

export interface TopPerformerItem {
  name: string;
  type: string;
  initialAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface PerformanceByTypeItem {
  type: string;
  count: number;
  totalInvested: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface MonthlyTrendItem {
  month: string;
  value: number;
  investedAmount: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface InvestmentDistributionReport {
  reportTitle: string;
  generatedAt: string;
  totalPortfolioValue: number;
  totalInvestments: number;
  distributionByType: DistributionItem[];
  distributionByStatus: DistributionItem[];
  investmentSizeDistribution: InvestmentSizeRange[];
  investments: InvestmentDetailItem[];
}

export interface InvestmentSizeRange {
  range: string;
  count: number;
  totalValue: number;
}

export interface InvestmentDetailItem {
  name: string;
  type: string;
  status: string;
  initialAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  purchaseDate: string;
}

export interface TransactionHistoryReport {
  reportTitle: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  totalTransactions: number;
  totalVolume: number;
  buyTransactions: number;
  buyVolume: number;
  sellTransactions: number;
  sellVolume: number;
  updateTransactions: number;
  transactionsByType: TransactionsByTypeItem[];
  transactionsByMonth: TransactionsByMonthItem[];
  transactions: TransactionDetailItem[];
}

export interface DistributionItem {
  category: string;
  count: number;
  value: number;
  percentage: number;
  color: string;
}

export interface TopInvestmentItem {
  id?: number;
  rank: number;
  name: string;
  type: string;
  status: string;
  initialAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  purchaseDate: string;
  daysHeld: number;
  annualizedReturn: number;
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
  volume: number;
  percentage: number;
}

export interface TransactionsByMonthItem {
  month: string;
  count: number;
  volume: number;
}

export interface TransactionDetailItem {
  date: string;
  investmentName: string;
  investmentType: string;
  transactionType: string;
  quantity: number;
  pricePerUnit: number;
  amount: number;
  notes?: string;
}

export interface ExportReportRequest {
  reportType: string;
  format: 'pdf' | 'excel' | 'csv';
  dateRange?: ReportDateRange;
}

export interface YearOverYearReport {
  reportTitle: string;
  generatedAt: string;
  yearsCovered: number[];
  yearlySummaries: YearSummaryItem[];
  yearOverYearGrowth: YearOverYearGrowthItem[];
  bestYear?: YearSummaryItem;
  worstYear?: YearSummaryItem;
  chartLabels: string[];
  chartEndingValues: number[];
  chartGrowthPercentages: number[];
}

export interface YearSummaryItem {
  year: number;
  startingValue: number;
  endingValue: number;
  totalInvested: number;
  growth: number;
  growthPercentage: number;
  totalTransactions: number;
  transactionVolume: number;
  newInvestments: number;
}

export interface YearOverYearGrowthItem {
  comparison: string; // "2024 vs 2023"
  growthDifference: number;
  growthDifferencePercentage: number;
  transactionCountDifference: number;
}

export interface TopPerformingInvestmentsReport {
  reportTitle: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  totalInvestmentsAnalyzed: number;
  topByPercentage: TopInvestmentItem[];
  topByAbsoluteGain: TopInvestmentItem[];
  topByValue: TopInvestmentItem[];
  typePerformanceSummaries: TypePerformanceSummary[];
}

export interface TypePerformanceSummary {
  type: string;
  count: number;
  averageGainLossPercentage: number;
  bestPerformancePercentage: number;
  worstPerformancePercentage: number;
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
