import axiosInstance from '../api';
import type {
  ApiResponse,
  PaginatedResponse,
  ActivityLog,
  ActivityLogFilterParams,
} from '@/types';

// ============================================
// Activity Log Service
// ============================================

export const activityLogService = {
  /**
   * Get all activity logs with filters and pagination
   */
  getAll: async (params?: ActivityLogFilterParams) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<ActivityLog>>
    >('/api/activity-logs', { params });
    return response.data;
  },

  /**
   * Get activity logs for current user
   */
  getMyLogs: async (pageNumber = 1, pageSize = 20) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<ActivityLog>>
    >('/api/activity-logs/my-logs', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  /**
   * Get activity logs by user ID (Admin only)
   */
  getByUser: async (userId: string, pageNumber = 1, pageSize = 20) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<ActivityLog>>
    >(`/api/activity-logs/user/${userId}`, {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  /**
   * Get recent activity logs
   */
  getRecent: async (limit = 10) => {
    const response = await axiosInstance.get<ApiResponse<ActivityLog[]>>(
      '/api/activity-logs/recent',
      { params: { limit } }
    );
    return response.data;
  },
};
