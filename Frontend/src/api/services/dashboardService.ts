import axiosInstance from '../api';
import type { ApiResponse, DashboardStats, AdminDashboardStats } from '@/types';

// ============================================
// Dashboard Service
// ============================================

export const dashboardService = {
  /**
   * Get user dashboard statistics
   */
  getUserStats: async () => {
    const response = await axiosInstance.get<ApiResponse<DashboardStats>>(
      '/api/dashboard'
    );
    return response.data;
  },

  /**
   * Get admin dashboard statistics
   */
  getAdminStats: async () => {
    const response = await axiosInstance.get<ApiResponse<AdminDashboardStats>>(
      '/api/dashboard/admin'
    );
    return response.data;
  },

  /**
   * Get portfolio distribution data
   */
  getPortfolioDistribution: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(
      '/api/dashboard/portfolio-distribution'
    );
    return response.data;
  },

  /**
   * Get investment performance over time
   */
  getPerformanceOverTime: async (days = 30) => {
    const response = await axiosInstance.get<ApiResponse<any>>(
      '/api/dashboard/performance-over-time',
      { params: { days } }
    );
    return response.data;
  },
};
