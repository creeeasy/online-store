// store/slices/loadingSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { validateToken, loginUser, registerUser } from './authSlice';
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
      // validateToken loading states
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
      })
      // loginUser loading states
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Logging in...';
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      // registerUser loading states
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = 'Registering user...';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      });
  },
});
export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;