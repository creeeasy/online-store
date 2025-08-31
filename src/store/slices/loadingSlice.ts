import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginAdmin, logoutAdmin, checkAuthStatus } from './authSlice';
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
      // Auth loading states
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Logging in...';
      })
      .addCase(loginAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      .addCase(loginAdmin.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Logging out...';
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      
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
      });
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
