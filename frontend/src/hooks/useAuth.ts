import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetAuth } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import type { User } from '../store/types';
import { clearAuthToken, setAuthToken, type ApiError } from '../utils/apiClient';
import { authAPI } from '../utils/authAPI';
import { useAppDispatch } from './redux';

export const useLoginAdmin = () => {

  return useMutation<
    User,
    ApiError,
    { email: string; password: string }
  >({
    mutationFn: async (credentials) => {
      const response = await authAPI.login(credentials);
      
      // Set the token in the API client
      setAuthToken(response.token);
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.token);
      
      return response.user;
    },
    onSuccess: (user) => {
      // Store user data in localStorage
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      toast.success('Login successful!');
    },
    onError: (error) => {
      clearAuthToken();
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      
      if (error.validationErrors && error.validationErrors.length > 0) {
        // Validation errors are handled in the form
        return;
      }
      
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useLogoutAdmin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authAPI.logout();
      } catch (error) {
        // Even if server logout fails, we still want to clear client state
        console.warn('Server logout failed, clearing client state anyway');
      }
      
      // Always clear client state
      clearAuthToken();
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      
      return { success: true };
    },
    onSuccess: () => {
      // Clear Redux state
      dispatch(resetAuth());
      
      // Clear React Query cache
      queryClient.clear();
      
      toast.success('Logged out successfully');
    },
    onError: (error: ApiError) => {
      // Still clear state even if server logout failed
      clearAuthToken();
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      dispatch(resetAuth());
      queryClient.clear();
      
      toast.error(error.message || 'Logout failed');
    },
  });
};

// Optional: Hook for token refresh
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await authAPI.refreshToken();
      setAuthToken(response.token);
      localStorage.setItem('authToken', response.token);
      return response.token;
    },
    onError: (error: ApiError) => {
      clearAuthToken();
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      
      if (error.status !== 401) {
        toast.error('Session refresh failed. Please login again.');
      }
    },
  });
};
