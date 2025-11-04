import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type {
  ApiResponse,
  PaginatedResponse,
  Portfolio,
  PortfolioDetail,
  Investment,
  InvestmentDetail,
  Transaction,
  DashboardStats,
  AdminDashboardStats,
  User,
  ActivityLog,
  PerformanceSummaryReport,
  InvestmentDistributionReport,
  TransactionHistoryReport,
  InvestmentFilterParams,
  TransactionFilterParams,
  ActivityLogFilterParams,
  ReportDateRange,
  PortfolioSummary,
  InvestmentSummary,
} from '@/types';
import {
  portfolioService,
  investmentService,
  transactionService,
  dashboardService,
  reportService,
  userService,
  activityLogService,
} from './services';

// ============================================
// Query Keys
// ============================================

export const queryKeys = {
  // Portfolios
  portfolios: ['portfolios'] as const,
  portfolio: (id: number) => ['portfolios', id] as const,
  portfolioSummaries: ['portfolios', 'summaries'] as const,
  portfolioPerformance: (id: number) =>
    ['portfolios', id, 'performance'] as const,

  // Investments
  investments: (params?: InvestmentFilterParams) =>
    ['investments', params] as const,
  investment: (id: number) => ['investments', id] as const,
  investmentSummaries: ['investments', 'summaries'] as const,
  investmentTypes: ['investments', 'types'] as const,
  investmentsByPortfolio: (portfolioId: number) =>
    ['investments', 'portfolio', portfolioId] as const,

  // Transactions
  transactions: (params?: TransactionFilterParams) =>
    ['transactions', params] as const,
  transaction: (id: number) => ['transactions', id] as const,
  transactionsByInvestment: (investmentId: number) =>
    ['transactions', 'investment', investmentId] as const,
  transactionTypes: ['transactions', 'types'] as const,
  recentTransactions: (limit?: number) =>
    ['transactions', 'recent', limit] as const,

  // Dashboard
  userDashboard: ['dashboard', 'user'] as const,
  adminDashboard: ['dashboard', 'admin'] as const,
  portfolioDistribution: ['dashboard', 'portfolio-distribution'] as const,
  performanceOverTime: (days?: number) =>
    ['dashboard', 'performance-over-time', days] as const,

  // Reports
  performanceSummary: (dateRange?: ReportDateRange) =>
    ['reports', 'performance-summary', dateRange] as const,
  investmentDistribution: (dateRange?: ReportDateRange) =>
    ['reports', 'investment-distribution', dateRange] as const,
  transactionHistory: (dateRange?: ReportDateRange) =>
    ['reports', 'transaction-history', dateRange] as const,
  topPerformers: (limit?: number) =>
    ['reports', 'top-performers', limit] as const,

  // Users
  userProfile: ['users', 'profile'] as const,
  user: (id: string) => ['users', id] as const,
  users: (pageNumber?: number, pageSize?: number) =>
    ['users', pageNumber, pageSize] as const,

  // Activity Logs
  activityLogs: (params?: ActivityLogFilterParams) =>
    ['activity-logs', params] as const,
  myActivityLogs: (pageNumber?: number, pageSize?: number) =>
    ['activity-logs', 'my-logs', pageNumber, pageSize] as const,
  userActivityLogs: (userId: string, pageNumber?: number, pageSize?: number) =>
    ['activity-logs', 'user', userId, pageNumber, pageSize] as const,
  recentActivityLogs: (limit?: number) =>
    ['activity-logs', 'recent', limit] as const,
};

// ============================================
// Portfolio Queries
// ============================================

export const usePortfolios = (
  pageNumber = 1,
  pageSize = 10,
  options?: UseQueryOptions<ApiResponse<PaginatedResponse<Portfolio>>>
) => {
  return useQuery({
    queryKey: queryKeys.portfolios,
    queryFn: () => portfolioService.getAll(pageNumber, pageSize),
    ...options,
  });
};

export const usePortfolio = (
  id: number,
  options?: UseQueryOptions<ApiResponse<PortfolioDetail>>
) => {
  return useQuery({
    queryKey: queryKeys.portfolio(id),
    queryFn: () => portfolioService.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const usePortfolioSummaries = (
  options?: UseQueryOptions<ApiResponse<PortfolioSummary[]>>
) => {
  return useQuery({
    queryKey: queryKeys.portfolioSummaries,
    queryFn: () => portfolioService.getSummaries(),
    ...options,
  });
};

export const usePortfolioPerformance = (
  id: number,
  options?: UseQueryOptions<ApiResponse<PortfolioDetail['performanceMetrics']>>
) => {
  return useQuery({
    queryKey: queryKeys.portfolioPerformance(id),
    queryFn: () => portfolioService.getPerformance(id),
    enabled: !!id,
    ...options,
  });
};

// ============================================
// Investment Queries
// ============================================

export const useInvestments = (
  params?: InvestmentFilterParams,
  options?: UseQueryOptions<ApiResponse<PaginatedResponse<Investment>>>
) => {
  return useQuery({
    queryKey: queryKeys.investments(params),
    queryFn: () => investmentService.getAll(params),
    ...options,
  });
};

export const useInvestment = (
  id: number,
  options?: UseQueryOptions<ApiResponse<InvestmentDetail>>
) => {
  return useQuery({
    queryKey: queryKeys.investment(id),
    queryFn: () => investmentService.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useInvestmentSummaries = (
  options?: UseQueryOptions<ApiResponse<InvestmentSummary[]>>
) => {
  return useQuery({
    queryKey: queryKeys.investmentSummaries,
    queryFn: () => investmentService.getSummaries(),
    ...options,
  });
};

export const useInvestmentTypes = (
  options?: UseQueryOptions<ApiResponse<string[]>>
) => {
  return useQuery({
    queryKey: queryKeys.investmentTypes,
    queryFn: () => investmentService.getTypes(),
    ...options,
  });
};

export const useInvestmentsByPortfolio = (
  portfolioId: number,
  options?: UseQueryOptions<ApiResponse<Investment[]>>
) => {
  return useQuery({
    queryKey: queryKeys.investmentsByPortfolio(portfolioId),
    queryFn: () => investmentService.getByPortfolio(portfolioId),
    enabled: !!portfolioId,
    ...options,
  });
};

// ============================================
// Transaction Queries
// ============================================

export const useTransactions = (
  params?: TransactionFilterParams,
  options?: UseQueryOptions<ApiResponse<PaginatedResponse<Transaction>>>
) => {
  return useQuery({
    queryKey: queryKeys.transactions(params),
    queryFn: () => transactionService.getAll(params),
    ...options,
  });
};

export const useTransaction = (
  id: number,
  options?: UseQueryOptions<ApiResponse<Transaction>>
) => {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useTransactionsByInvestment = (
  investmentId: number,
  options?: UseQueryOptions<ApiResponse<Transaction[]>>
) => {
  return useQuery({
    queryKey: queryKeys.transactionsByInvestment(investmentId),
    queryFn: () => transactionService.getByInvestment(investmentId),
    enabled: !!investmentId,
    ...options,
  });
};

export const useTransactionTypes = (
  options?: UseQueryOptions<ApiResponse<string[]>>
) => {
  return useQuery({
    queryKey: queryKeys.transactionTypes,
    queryFn: () => transactionService.getTypes(),
    ...options,
  });
};

export const useRecentTransactions = (
  limit = 10,
  options?: UseQueryOptions<ApiResponse<Transaction[]>>
) => {
  return useQuery({
    queryKey: queryKeys.recentTransactions(limit),
    queryFn: () => transactionService.getRecent(limit),
    ...options,
  });
};

// ============================================
// Dashboard Queries
// ============================================

export const useUserDashboard = (
  options?: UseQueryOptions<ApiResponse<DashboardStats>>
) => {
  return useQuery({
    queryKey: queryKeys.userDashboard,
    queryFn: () => dashboardService.getUserStats(),
    ...options,
  });
};

export const useAdminDashboard = (
  options?: UseQueryOptions<ApiResponse<AdminDashboardStats>>
) => {
  return useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: () => dashboardService.getAdminStats(),
    ...options,
  });
};

export const usePortfolioDistribution = (
  options?: UseQueryOptions<ApiResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.portfolioDistribution,
    queryFn: () => dashboardService.getPortfolioDistribution(),
    ...options,
  });
};

export const usePerformanceOverTime = (
  days = 30,
  options?: UseQueryOptions<ApiResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.performanceOverTime(days),
    queryFn: () => dashboardService.getPerformanceOverTime(days),
    ...options,
  });
};

// ============================================
// Report Queries
// ============================================

export const usePerformanceSummary = (
  dateRange?: ReportDateRange,
  options?: UseQueryOptions<ApiResponse<PerformanceSummaryReport>>
) => {
  return useQuery({
    queryKey: queryKeys.performanceSummary(dateRange),
    queryFn: () => reportService.getPerformanceSummary(dateRange),
    ...options,
  });
};

export const useInvestmentDistribution = (
  dateRange?: ReportDateRange,
  options?: UseQueryOptions<ApiResponse<InvestmentDistributionReport>>
) => {
  return useQuery({
    queryKey: queryKeys.investmentDistribution(dateRange),
    queryFn: () => reportService.getInvestmentDistribution(dateRange),
    ...options,
  });
};

export const useTransactionHistory = (
  dateRange?: ReportDateRange,
  options?: UseQueryOptions<ApiResponse<TransactionHistoryReport>>
) => {
  return useQuery({
    queryKey: queryKeys.transactionHistory(dateRange),
    queryFn: () => reportService.getTransactionHistory(dateRange),
    ...options,
  });
};

export const useTopPerformers = (
  limit = 10,
  options?: UseQueryOptions<ApiResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.topPerformers(limit),
    queryFn: () => reportService.getTopPerformers(limit),
    ...options,
  });
};

// ============================================
// User Queries
// ============================================

export const useUserProfile = (
  options?: UseQueryOptions<ApiResponse<User>>
) => {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: () => userService.getProfile(),
    ...options,
  });
};

export const useUser = (
  id: string,
  options?: UseQueryOptions<ApiResponse<User>>
) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useUsers = (
  pageNumber = 1,
  pageSize = 10,
  options?: UseQueryOptions<ApiResponse<PaginatedResponse<User>>>
) => {
  return useQuery({
    queryKey: queryKeys.users(pageNumber, pageSize),
    queryFn: () => userService.getAll(pageNumber, pageSize),
    ...options,
  });
};

// ============================================
// Activity Log Queries
// ============================================

export const useActivityLogs = (
  params?: ActivityLogFilterParams,
  options?: UseQueryOptions<ApiResponse<PaginatedResponse<ActivityLog>>>
) => {
  return useQuery({
    queryKey: queryKeys.activityLogs(params),
    queryFn: () => activityLogService.getAll(params),
    ...options,
  });
};

export const useMyActivityLogs = (
  pageNumber = 1,
  pageSize = 20,
  options?: UseQueryOptions<ApiResponse<PaginatedResponse<ActivityLog>>>
) => {
  return useQuery({
    queryKey: queryKeys.myActivityLogs(pageNumber, pageSize),
    queryFn: () => activityLogService.getMyLogs(pageNumber, pageSize),
    ...options,
  });
};

export const useUserActivityLogs = (
  userId: string,
  pageNumber = 1,
  pageSize = 20,
  options?: UseQueryOptions<ApiResponse<PaginatedResponse<ActivityLog>>>
) => {
  return useQuery({
    queryKey: queryKeys.userActivityLogs(userId, pageNumber, pageSize),
    queryFn: () => activityLogService.getByUser(userId, pageNumber, pageSize),
    enabled: !!userId,
    ...options,
  });
};

export const useRecentActivityLogs = (
  limit = 10,
  options?: UseQueryOptions<ApiResponse<ActivityLog[]>>
) => {
  return useQuery({
    queryKey: queryKeys.recentActivityLogs(limit),
    queryFn: () => activityLogService.getRecent(limit),
    ...options,
  });
};
