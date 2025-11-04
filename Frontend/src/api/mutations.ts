import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  Portfolio,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
  Investment,
  BulkDeleteRequest,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  Transaction,
  TransactionPreview,
  TransactionPreviewResult,
  UpdateUserRequest,
  User,
  ChangePasswordRequest,
  ExportReportRequest,
} from '@/types';
import {
  authApi,
  portfolioService,
  investmentService,
  transactionService,
  reportService,
  userService,
} from './services';
import { queryKeys } from './quries';
import { handleApiError } from './api';

// ============================================
// Mutation Options Type
// ============================================

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
>;

// ============================================
// Auth Mutations
// ============================================

export const useLogin = (
  options?: MutationOptions<ApiResponse<AuthResponse>, LoginRequest>
) => {
  return useMutation({
    mutationFn: authApi.login,
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useRegister = (
  options?: MutationOptions<ApiResponse<AuthResponse>, RegisterRequest>
) => {
  return useMutation({
    mutationFn: authApi.register,
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useForgotPassword = (
  options?: MutationOptions<ApiResponse, ForgotPasswordRequest>
) => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useResetPassword = (
  options?: MutationOptions<ApiResponse, ResetPasswordRequest>
) => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

// ============================================
// Portfolio Mutations
// ============================================

export const useCreatePortfolio = (
  options?: MutationOptions<ApiResponse<Portfolio>, CreatePortfolioRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: portfolioService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolioSummaries });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      toast.success('Portfolio created successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useUpdatePortfolio = (
  options?: MutationOptions<
    ApiResponse<Portfolio>,
    { id: number; data: UpdatePortfolioRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => portfolioService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolio(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolioSummaries });
      toast.success('Portfolio updated successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useDeletePortfolio = (
  options?: MutationOptions<ApiResponse, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: portfolioService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolioSummaries });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      toast.success('Portfolio deleted successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

// ============================================
// Investment Mutations
// ============================================

export const useCreateInvestment = (
  options?: MutationOptions<ApiResponse<Investment>, CreateInvestmentRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: investmentService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investmentSummaries,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      toast.success('Investment created successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useUpdateInvestment = (
  options?: MutationOptions<
    ApiResponse<Investment>,
    { id: number; data: UpdateInvestmentRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => investmentService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investment(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investmentSummaries,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      toast.success('Investment updated successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useDeleteInvestment = (
  options?: MutationOptions<ApiResponse, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: investmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investmentSummaries,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      toast.success('Investment deleted successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useBulkDeleteInvestments = (
  options?: MutationOptions<ApiResponse, BulkDeleteRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: investmentService.bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investmentSummaries,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      toast.success('Investments deleted successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

// ============================================
// Transaction Mutations
// ============================================

export const useCreateTransaction = (
  options?: MutationOptions<ApiResponse<Transaction>, CreateTransactionRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recentTransactions(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
      toast.success('Transaction created successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useUpdateTransaction = (
  options?: MutationOptions<
    ApiResponse<Transaction>,
    { id: number; data: UpdateTransactionRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => transactionService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transaction(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recentTransactions(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      toast.success('Transaction updated successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useDeleteTransaction = (
  options?: MutationOptions<ApiResponse, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recentTransactions(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
      toast.success('Transaction deleted successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const usePreviewTransaction = (
  options?: MutationOptions<
    ApiResponse<TransactionPreviewResult>,
    TransactionPreview
  >
) => {
  return useMutation({
    mutationFn: transactionService.preview,
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

// ============================================
// User Mutations
// ============================================

export const useUpdateProfile = (
  options?: MutationOptions<
    ApiResponse<User>,
    { userId: string; data: UpdateUserRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }) => userService.updateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useChangePassword = (
  options?: MutationOptions<ApiResponse, ChangePasswordRequest>
) => {
  return useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useUpdateUser = (
  options?: MutationOptions<
    ApiResponse<User>,
    { id: string; data: UpdateUserRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) });
      toast.success('User updated successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useDeleteUser = (
  options?: MutationOptions<ApiResponse, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
      toast.success('User deleted successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

export const useToggleUserStatus = (
  options?: MutationOptions<ApiResponse<User>, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() });
      toast.success('User status updated successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

// ============================================
// Report Mutations
// ============================================

export const useExportReport = (
  options?: MutationOptions<Blob, ExportReportRequest>
) => {
  return useMutation({
    mutationFn: reportService.exportReport,
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${variables.reportType}-report.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report exported successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};
