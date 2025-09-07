// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';
import { authAPI } from '../../utils/api';
import { loginAdmin, logoutAdmin } from '../../hooks/useAuth';

// Async thunk for token validation
export const validateToken = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.validateToken();
      
      if (!response.success) {
        return rejectWithValue(response.message || 'Token validation failed');
      }

      // Get user data from localStorage or make additional API call if needed
      const userData = localStorage.getItem('adminUser');
      if (userData) {
        return JSON.parse(userData) as User;
      }

      // If user data not in localStorage, fetch it
      const meResponse = await authAPI.getMe();
      return meResponse.data?.user as User;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Token validation failed'
      );
    }
  }
);

// Async thunk for checking existing session (updated)
export const checkAuthStatus = createAsyncThunk<User | null, void>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Validate token first
      const validationResult = await dispatch(validateToken());
      
      if (validateToken.fulfilled.match(validationResult)) {
        return validationResult.payload;
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        return null;
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');
      return rejectWithValue(
        error instanceof Error ? error.message : 'Auth check failed'
      );
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      })

      // Token validation cases
      .addCase(validateToken.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Token validation failed';
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
      })

      // Check auth status cases
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<User | null>) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      // Logout cases
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch user data');
      }

      const user: User = response.data.user;
      
      // Update localStorage with fresh user data
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user data'
      );
    }
  }
);

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;