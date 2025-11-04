import axiosInstance from '../api';
import type {
  ApiResponse,
  PaginatedResponse,
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilterParams,
  TransactionPreview,
  TransactionPreviewResult,
} from '@/types';

// ============================================
// Transaction Service
// ============================================

export const transactionService = {
  /**
   * Get all transactions with optional filters and pagination
   */
  getAll: async (params?: TransactionFilterParams) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Transaction>>
    >('/api/transactions', { params });
    return response.data;
  },

  /**
   * Get a single transaction by ID
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Transaction>>(
      `/api/transactions/${id}`
    );
    return response.data;
  },

  /**
   * Create a new transaction
   */
  create: async (data: CreateTransactionRequest) => {
    const response = await axiosInstance.post<ApiResponse<Transaction>>(
      '/api/transactions',
      data
    );
    return response.data;
  },

  /**
   * Update an existing transaction
   */
  update: async (id: number, data: UpdateTransactionRequest) => {
    const response = await axiosInstance.put<ApiResponse<Transaction>>(
      `/api/transactions/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a transaction
   */
  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse>(
      `/api/transactions/${id}`
    );
    return response.data;
  },

  /**
   * Get transactions by investment ID
   */
  getByInvestment: async (investmentId: number) => {
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>(
      `/api/transactions/investment/${investmentId}`
    );
    return response.data;
  },

  /**
   * Preview transaction impact before creating
   */
  preview: async (data: TransactionPreview) => {
    const response = await axiosInstance.post<
      ApiResponse<TransactionPreviewResult>
    >('/api/transactions/preview', data);
    return response.data;
  },

  /**
   * Get transaction types
   */
  getTypes: async () => {
    const response = await axiosInstance.get<ApiResponse<string[]>>(
      '/api/transactions/types'
    );
    return response.data;
  },

  /**
   * Get recent transactions
   */
  getRecent: async (limit = 10) => {
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>(
      '/api/transactions/recent',
      { params: { limit } }
    );
    return response.data;
  },
};
