// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';
import { authAPI } from '../../utils/authAPI';
import { clearAuthToken, setAuthToken, type ApiError } from '../../utils/apiClient';
export const registerAdmin = createAsyncThunk<
  User,
  { username: string; email: string; password: string; role: 'admin' },
  { rejectValue: ApiError }
>(
  'auth/registerAdmin',
  async (registrationData, { rejectWithValue }) => {
    try {
      // This would call your registration API endpoint
      // You'll need to add a register method to your authAPI
      const response = await authAPI.register(registrationData);
      
      // Set the token if registration includes automatic login
      if (response.token) {
        setAuthToken(response.token);
      }
      
      // Store user data in localStorage
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);
// Async thunk for login
export const loginAdmin = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: ApiError }
>(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Set the token in the API client and localStorage
      setAuthToken(response.token);
      
      // Store user data in localStorage
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for logout
export const logoutAdmin = createAsyncThunk<
  { success: boolean; message: string },
  void,
  { rejectValue: ApiError }
>(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.logout();
      
      // Clear token and user data
      clearAuthToken();
      localStorage.removeItem('adminUser');
      
      return response;
    } catch (error) {
      // Even if the server request fails, clear local authentication
      clearAuthToken();
      localStorage.removeItem('adminUser');
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for token validation
export const validateToken = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiError }
>(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      
      // Get user data from localStorage or make additional API call if needed
      const userData = localStorage.getItem('adminUser');
      if (userData) {
        return JSON.parse(userData) as User;
      }

      // If user data not in localStorage, fetch it
      const meResponse = await authAPI.getMe();
      return meResponse.user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError);
    }
  }
);

// Async thunk for checking existing session
export const checkAuthStatus = createAsyncThunk<User | null, void>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      // Set the token in the API client
      setAuthToken(token);

      // Validate token first
      const validationResult = await dispatch(validateToken());
      
      if (validateToken.fulfilled.match(validationResult)) {
        return validationResult.payload;
      } else {
        // Token is invalid, clear storage
        clearAuthToken();
        localStorage.removeItem('adminUser');
        return null;
      }
    } catch (error) {
      clearAuthToken();
      localStorage.removeItem('adminUser');
      return rejectWithValue(error as ApiError);
    }
  }
);

// Async thunk for getting current user
export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiError }
>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      
      const user: User = response.user;
      
      // Update localStorage with fresh user data
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      return user;
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
      localStorage.removeItem('adminUser');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        localStorage.setItem('adminUser', JSON.stringify(action.payload));
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
        clearAuthToken();
        localStorage.removeItem('adminUser');
      })

      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        localStorage.setItem('adminUser', JSON.stringify(action.payload));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        clearAuthToken();
        localStorage.removeItem('adminUser');
      })

      // Token validation cases
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action: PayloadAction<User>) => {
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
        clearAuthToken();
        localStorage.removeItem('adminUser');
      })

      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<User | null>) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload?.message || 'Auth check failed';
      })

      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        localStorage.setItem('adminUser', JSON.stringify(action.payload));
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch user data';
        // Don't clear auth state here - token might still be valid
      })

      // Logout cases
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        clearAuthToken();
        localStorage.removeItem('adminUser');
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Logout failed';
        // Still clear local state even if server logout failed
        state.user = null;
        state.isAuthenticated = false;
        clearAuthToken();
        localStorage.removeItem('adminUser');
      });
  },
});

export const { clearError, resetAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;