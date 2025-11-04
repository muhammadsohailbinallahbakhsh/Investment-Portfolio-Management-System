import axiosInstance from '../api';
import type {
  ApiResponse,
  PaginatedResponse,
  Investment,
  InvestmentDetail,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
  InvestmentFilterParams,
  BulkDeleteRequest,
  InvestmentSummary,
} from '@/types';

// ============================================
// Investment Service
// ============================================

export const investmentService = {
  /**
   * Get all investments with optional filters and pagination
   */
  getAll: async (params?: InvestmentFilterParams) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Investment>>
    >('/api/investments', { params });
    return response.data;
  },

  /**
   * Get a single investment by ID with full details
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<InvestmentDetail>>(
      `/api/investments/${id}`
    );
    return response.data;
  },

  /**
   * Create a new investment
   */
  create: async (data: CreateInvestmentRequest) => {
    const response = await axiosInstance.post<ApiResponse<Investment>>(
      '/api/investments',
      data
    );
    return response.data;
  },

  /**
   * Update an existing investment
   */
  update: async (id: number, data: UpdateInvestmentRequest) => {
    const response = await axiosInstance.put<ApiResponse<Investment>>(
      `/api/investments/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete an investment
   */
  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse>(
      `/api/investments/${id}`
    );
    return response.data;
  },

  /**
   * Bulk delete multiple investments
   */
  bulkDelete: async (data: BulkDeleteRequest) => {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/investments/bulk-delete',
      data
    );
    return response.data;
  },

  /**
   * Get investment summaries for dropdowns
   */
  getSummaries: async () => {
    const response = await axiosInstance.get<ApiResponse<InvestmentSummary[]>>(
      '/api/investments/summaries'
    );
    return response.data;
  },

  /**
   * Get investments by portfolio ID
   */
  getByPortfolio: async (portfolioId: number) => {
    const response = await axiosInstance.get<ApiResponse<Investment[]>>(
      `/api/investments/portfolio/${portfolioId}`
    );
    return response.data;
  },

  /**
   * Get investment types
   */
  getTypes: async () => {
    const response = await axiosInstance.get<ApiResponse<string[]>>(
      '/api/investments/types'
    );
    return response.data;
  },
};
