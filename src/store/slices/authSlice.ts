import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../types';
import type { User } from '../types';

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: '12345678'
};

// Simulate API call with delay
const simulateApiCall = <T>(data: T, delay: number = 1500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Async thunk for login
export const loginAdmin = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await simulateApiCall(null, 1500);
      
      // Validate credentials
      if (
        credentials.email === ADMIN_CREDENTIALS.email &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        const user: User = {
          email: credentials.email,
          role: 'admin'
        };
        
        // Store in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(user));
        
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  }
);

// Async thunk for logout
export const logoutAdmin = createAsyncThunk<void, void>(
  'auth/logoutAdmin',
  async () => {
    // Simulate API delay
    await simulateApiCall(null, 800);
    
    // Remove from localStorage
    localStorage.removeItem('adminUser');
  }
);

// Async thunk for checking existing session
export const checkAuthStatus = createAsyncThunk<User | null, void>(
  'auth/checkAuthStatus',
  async () => {
    // Simulate API delay
    await simulateApiCall(null, 1000);
    
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      return JSON.parse(storedUser) as User;
    }
    return null;
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
      localStorage.removeItem('adminUser');
    }
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
      
      // Logout cases
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
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
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
