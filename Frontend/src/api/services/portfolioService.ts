import axiosInstance from '../api';
import type {
  ApiResponse,
  PaginatedResponse,
  Portfolio,
  PortfolioDetail,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  PortfolioSummary,
} from '@/types';

// ============================================
// Portfolio Service
// ============================================

export const portfolioService = {
  /**
   * Get all portfolios for the current user with pagination
   */
  getAll: async (pageNumber = 1, pageSize = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Portfolio>>
    >('/api/portfolios', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  /**
   * Get a single portfolio by ID with full details
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<PortfolioDetail>>(
      `/api/portfolios/${id}`
    );
    return response.data;
  },

  /**
   * Create a new portfolio
   */
  create: async (data: CreatePortfolioRequest) => {
    const response = await axiosInstance.post<ApiResponse<Portfolio>>(
      '/api/portfolios',
      data
    );
    return response.data;
  },

  /**
   * Update an existing portfolio
   */
  update: async (id: number, data: UpdatePortfolioRequest) => {
    const response = await axiosInstance.put<ApiResponse<Portfolio>>(
      `/api/portfolios/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a portfolio
   */
  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse>(
      `/api/portfolios/${id}`
    );
    return response.data;
  },

  /**
   * Get portfolio summaries for dropdowns
   */
  getSummaries: async () => {
    const response = await axiosInstance.get<ApiResponse<PortfolioSummary[]>>(
      '/api/portfolios/summaries'
    );
    return response.data;
  },

  /**
   * Get portfolio performance metrics
   */
  getPerformance: async (id: number) => {
    const response = await axiosInstance.get<
      ApiResponse<PortfolioDetail['performanceMetrics']>
    >(`/api/portfolios/${id}/performance`);
    return response.data;
  },
};
