// hooks/useTokenRefresh.ts
import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { validateToken } from '../store/slices/authSlice';

export const useTokenRefresh = (intervalMinutes = 30) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await dispatch(validateToken()).unwrap();
        } catch (error) {
          console.warn('Token refresh failed:', error);
        }
      }
    };

    // Refresh immediately on mount
    refreshToken();

    // Set up interval for periodic refresh
    const interval = setInterval(refreshToken, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, intervalMinutes]);
};