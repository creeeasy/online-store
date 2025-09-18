// hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from './redux';
import { loginUser, registerUser, resetAuth } from '../store/slices/authSlice';
import { authAPI } from '../utils/authAPI';
import { clearAuthToken, setAuthToken, type ApiError } from '../utils/apiClient';
import type { User } from '../store/types';

// Use Redux for login (to maintain consistency with your existing setup)
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation<
    User,
    ApiError,
    { email: string; password: string }
  >({
    mutationFn: async (credentials) => {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.rejected.match(result)) {
        throw result.payload;
      }
      return result.payload;
    },
    onSuccess: () => {
      toast.success('Login successful!');
      navigate('/admin');
    },
    onError: (error) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        return; // Let form handle validation errors
      }
      toast.error(error.message || 'Login failed');
    },
  });
};

// Use Redux for registration
export const useRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation<
    User,
    ApiError,
    { username: string; email: string; password: string; role: 'admin' }
  >({
    mutationFn: async (registrationData) => {
      const result = await dispatch(registerUser(registrationData));
      if (registerUser.rejected.match(result)) {
        throw result.payload;
      }
      return result.payload;
    },
    onSuccess: () => {
      toast.success('Registration successful!');
      navigate('/admin');
    },
    onError: (error) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        return; // Let form handle validation errors
      }
      toast.error(error.message || 'Registration failed');
    },
  });
};

// Use React Query for logout (since it's simpler)
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authAPI.logout();
      } catch (error) {
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
      navigate('/admin/login');
    },
    onError: (error: ApiError) => {
      // Still clear state even if server logout failed
      dispatch(resetAuth());
      queryClient.clear();
      
      toast.error(error.message || 'Logout failed');
      navigate('/admin/login');
    },
  });
};

// Custom hook to get auth state
export const useAuthState = () => {
  const authState = useAppSelector((state) => state.auth);
  return authState;
};

// Optional: Token refresh hook
export const useRefreshToken = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      const response = await authAPI.refreshToken();
      setAuthToken(response.token);
      localStorage.setItem('authToken', response.token);
      return response.token;
    },
    onError: (error: ApiError) => {
      if (error.status === 401) {
        // Token refresh failed, user needs to login again
        dispatch(resetAuth());
      } else {
        toast.error('Session refresh failed. Please login again.');
        dispatch(resetAuth());
      }
    },
  });
};