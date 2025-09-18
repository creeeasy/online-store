// store/slices/authSlice.ts (Updated)
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';
import { authAPI } from '../../utils/authAPI';
import { clearAuthToken, setAuthToken, type ApiError } from '../../utils/apiClient';

// Simplified async thunk for token validation
export const validateToken = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiError }
>(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Set token in API client
      setAuthToken(token);

      // Try to get user data from localStorage first
      const userData = localStorage.getItem('adminUser');
      if (userData) {
        try {
          const user = JSON.parse(userData) as User;
          // Optionally validate with server
          await authAPI.getMe(); // Just to check if token is still valid
          return user;
        } catch {
          // If server validation fails, continue to fetch fresh data
        }
      }

      // Fetch fresh user data from server
      const response = await authAPI.getMe();
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      // Clear invalid token
      clearAuthToken();
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      return rejectWithValue(error as ApiError);
    }
  }
);

// Login with React Query integration
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: ApiError }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Set token
      setAuthToken(response.token);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Register admin
export const registerUser = createAsyncThunk<
  User,
  { username: string; email: string; password: string; role: 'admin' },
  { rejectValue: ApiError }
>(
  'auth/registerUser',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(registrationData);
      
      if (response.token) {
        setAuthToken(response.token);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
      }
      
      return response.user;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
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
      state.isLoading = false;
      state.error = null;
      clearAuthToken();
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Validate Token
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload?.message || 'Token validation failed';
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      });
  },
});

export const { clearError, resetAuth, setUser } = authSlice.actions;
export default authSlice.reducer;