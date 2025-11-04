import axios, { type AxiosError, type AxiosResponse } from 'axios';
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
} from '@/types';

// ============================================
// Axios Instance Configuration
// ============================================

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// ============================================
// Request Interceptor
// ============================================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor with Token Refresh
// ============================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If error is not 401 or request already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (!refreshToken || !accessToken) {
      isRefreshing = false;
      handleLogout();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post<ApiResponse<AuthResponse>>(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh-token`,
        {
          token: accessToken,
          refreshToken: refreshToken,
        } as RefreshTokenRequest
      );

      if (response.data.success && response.data.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      handleLogout();
      return Promise.reject(refreshError);
    }
  }
);

// ============================================
// Helper Functions
// ============================================

const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/auth/login';
};

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    // Server responded with error
    if (axiosError.response?.data) {
      const data = axiosError.response.data;

      // Return first error if errors array exists
      if (data.errors && data.errors.length > 0) {
        return data.errors[0];
      }

      // Return message if it exists
      if (data.message) {
        return data.message;
      }
    }

    // Network error
    if (axiosError.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }

    // Timeout error
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    // Other axios errors
    return axiosError.message || 'An unexpected error occurred.';
  }

  // Non-axios error
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
};

// ============================================
// Auth API Functions
// ============================================

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/api/auth/login',
      data
    );
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/api/auth/register',
      data
    );
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/auth/password-reset-request',
      data
    );
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/auth/reset-password',
      data
    );
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/auth/change-password',
      data
    );
    return response.data;
  },

  refreshToken: async (data: RefreshTokenRequest) => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/api/auth/refresh-token',
      data
    );
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axiosInstance.get<ApiResponse>(
      `/api/auth/verify-email?token=${token}`
    );
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post<ApiResponse>('/api/auth/logout');
    return response.data;
  },
};

// ============================================
// Export
// ============================================

export default axiosInstance;
