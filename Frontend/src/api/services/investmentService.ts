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
   * Backend expects: Page, PageSize, PortfolioId, Type, Status, SearchTerm, SortBy, SortOrder
   * Returns PagedResponse<InvestmentDto> directly (not wrapped in ApiResponse)
   */
  getAll: async (params?: InvestmentFilterParams) => {
    // Map frontend params to backend params (capitalize first letter)
    const backendParams = params
      ? {
          Page: params.pageNumber,
          PageSize: params.pageSize,
          PortfolioId: params.portfolioId,
          Type: params.type,
          Status: params.status,
          SearchTerm: params.searchTerm,
          SortBy: params.sortBy,
          SortOrder: params.sortOrder,
        }
      : undefined;

    const response = await axiosInstance.get<PaginatedResponse<Investment>>(
      '/api/investments',
      { params: backendParams }
    );
    return response.data;
  },

  /**
   * Get a single investment by ID with full details
   * Uses /detail endpoint from backend
   */
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<InvestmentDetail>>(
      `/api/investments/${id}/detail`
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
   * Backend expects: Name, Type, InitialAmount, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Notes, Status
   */
  update: async (id: number, data: UpdateInvestmentRequest) => {
    // Map frontend data to backend format (PascalCase)
    const backendData = {
      Name: data.name,
      Type: data.type,
      InitialAmount: data.initialAmount,
      Quantity: data.quantity,
      AveragePricePerUnit: data.averagePricePerUnit,
      PurchaseDate: data.purchaseDate,
      BrokerPlatform: data.brokerPlatform,
      Notes: data.notes,
      Status: data.status,
    };

    const response = await axiosInstance.put<ApiResponse<Investment>>(
      `/api/investments/${id}`,
      backendData
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
   * Backend expects { InvestmentIds: number[] }
   */
  bulkDelete: async (data: BulkDeleteRequest) => {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/investments/bulk-delete',
      { InvestmentIds: data.ids }
    );
    return response.data;
  },

  /**
   * Get user investment statistics
   */
  getStats: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(
      '/api/investments/stats'
    );
    return response.data;
  },
};
