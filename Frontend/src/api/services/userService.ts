import axiosInstance from '../api';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UpdateUserRequest,
  ChangePasswordRequest,
} from '@/types';

// ============================================
// User Service
// ============================================

export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await axiosInstance.get<ApiResponse<User>>(
      '/api/users/profile'
    );
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UpdateUserRequest) => {
    const response = await axiosInstance.put<ApiResponse<User>>(
      '/api/users/profile',
      data
    );
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest) => {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/users/change-password',
      data
    );
    return response.data;
  },

  /**
   * Get user by ID (Admin only)
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<User>>(
      `/api/users/${id}`
    );
    return response.data;
  },

  /**
   * Get all users (Admin only)
   */
  getAll: async (pageNumber = 1, pageSize = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<User>>
    >('/api/users', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  /**
   * Update user by ID (Admin only)
   */
  updateUser: async (id: string, data: UpdateUserRequest) => {
    const response = await axiosInstance.put<ApiResponse<User>>(
      `/api/users/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete user (Admin only)
   */
  deleteUser: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse>(
      `/api/users/${id}`
    );
    return response.data;
  },

  /**
   * Toggle user active status (Admin only)
   */
  toggleUserStatus: async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      `/api/users/${id}/toggle-status`
    );
    return response.data;
  },
};
