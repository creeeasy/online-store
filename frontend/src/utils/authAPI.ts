import type { User } from '../store/types';
import { apiClient, ApiError } from './apiClient';

export const authAPI = {


    register: async (registrationData: { 
    username: string; 
    email: string; 
    password: string; 
    role: 'admin' 
  }): Promise<{ 
    user: User; 
    token: string 
  }> => {
    const response = await apiClient.post<{ user: User; token: string }>(
      '/auth/register', 
      registrationData
    );
    return response.data;
  },
  // Validate token
  validateToken: async (): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.get<{ success: boolean }>('/auth/validate');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Get current user
  getMe: async (): Promise<{ user: User }> => {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Login
  login: async (credentials: { email: string; password: string }): Promise<{ 
    user: User; 
    token: string 
  }> => {
    try {
      const response = await apiClient.post<{ user: User; token: string }>(
        '/auth/login', 
        credentials
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/logout');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
};