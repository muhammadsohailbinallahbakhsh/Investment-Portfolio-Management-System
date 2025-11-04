import axiosInstance from '../api';
import type {
  ApiResponse,
  ReportDateRange,
  PerformanceSummaryReport,
  InvestmentDistributionReport,
  TransactionHistoryReport,
  ExportReportRequest,
} from '@/types';

// ============================================
// Report Service
// ============================================

export const reportService = {
  /**
   * Get performance summary report
   */
  getPerformanceSummary: async (dateRange?: ReportDateRange) => {
    const response = await axiosInstance.get<
      ApiResponse<PerformanceSummaryReport>
    >('/api/reports/performance-summary', {
      params: dateRange,
    });
    return response.data;
  },

  /**
   * Get investment distribution report
   */
  getInvestmentDistribution: async (dateRange?: ReportDateRange) => {
    const response = await axiosInstance.get<
      ApiResponse<InvestmentDistributionReport>
    >('/api/reports/investment-distribution', {
      params: dateRange,
    });
    return response.data;
  },

  /**
   * Get transaction history report
   */
  getTransactionHistory: async (dateRange?: ReportDateRange) => {
    const response = await axiosInstance.get<
      ApiResponse<TransactionHistoryReport>
    >('/api/reports/transaction-history', {
      params: dateRange,
    });
    return response.data;
  },

  /**
   * Export report in specified format
   */
  exportReport: async (data: ExportReportRequest) => {
    const response = await axiosInstance.post<Blob>(
      '/api/reports/export',
      data,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get top performing investments
   */
  getTopPerformers: async (limit = 10) => {
    const response = await axiosInstance.get<ApiResponse<any>>(
      '/api/reports/top-performers',
      { params: { limit } }
    );
    return response.data;
  },
};
