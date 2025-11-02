import axios from 'axios';
import type { SignUpRequest, SignUpResponse } from '@/types';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.post(
          `${
            import.meta.env.VITE_TurVistoAPI_BASE_URL
          }/authmanagement/RefreshToken`,
          {
            token: accessToken,
            refreshToken: refreshToken,
          }
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/user';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const getWeather = async () => {
  // let url = '/Weather';
  // return (await axiosInstance.get<WeatherResponse>(url)).data;
};

export const registerUser = async (user: SignUpRequest) => {
  try {
    let url = '/authmanagement/Register';
    return await axiosInstance.post<SignUpResponse>(url, user);
  } catch (error: any) {
    console.error(
      'Error occurred while registering the user:',
      error?.response?.data?.errors
    );
    throw error;
  }
};

export const loginUser = async (user: SignUpRequest) => {
  try {
    let url = '/authmanagement/Login';
    return await axiosInstance.post<SignUpResponse>(url, user);
  } catch (error: any) {
    console.error(
      'Error occurred while logging in the user:',
      error?.response?.data?.errors
    );
    throw error;
  }
};

export default axiosInstance;
