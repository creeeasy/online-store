import { createSlice } from '@reduxjs/toolkit';
import { checkAuthStatus, loginAdmin, register } from './useAuth';

interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: undefined,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message;
    },
    clearLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Admin
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Signing in...';
      })
      .addCase(loginAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = undefined;
      })
      .addCase(loginAdmin.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = undefined;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Creating account...';
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = undefined;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = undefined;
      })
      
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Checking authentication...';
      })
      .addCase(checkAuthStatus.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = undefined;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = undefined;
      });
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;