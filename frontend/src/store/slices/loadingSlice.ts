import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { checkAuthStatus, getCurrentUser, validateToken } from './authSlice';
import type { LoadingState } from '../types';

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: null,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || null;
    },
    clearLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCurrentUser loading states
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Loading user data...';
      })
      .addCase(getCurrentUser.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      
      // checkAuthStatus loading states
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Checking authentication...';
      })
      .addCase(checkAuthStatus.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      
      // Token validation loading states
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Validating session...';
      })
      .addCase(validateToken.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      .addCase(validateToken.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      });
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;