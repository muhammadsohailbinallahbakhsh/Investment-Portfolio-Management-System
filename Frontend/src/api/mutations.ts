import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser } from './api';

export function useRegisterUserMutation() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      registerUser(data),
    onSuccess: (response) => {
      const { token, refreshToken } = response.data;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      window.location.href = '/dashboard';
    },
  });
}

export function useLoginUserMutation() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => loginUser(data),
    onSuccess: (response) => {
      const { token, refreshToken } = response.data;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      window.location.href = '/dashboard';
    },
  });
}
