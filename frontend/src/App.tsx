// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { validateToken, resetAuth } from './store/slices/authSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import ClientNavbar from './components/ClientNavbar';
import AdminNavbar from './components/AdminNavbar';
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay';
import ProtectedRoute from './components/ProtectedRoute';
import InquiryDashboard from './pages/InquiryDashboard';
import { ThemeProvider } from './contexts/ThemeContext';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          await dispatch(validateToken()).unwrap();
        } catch (error) {
          // Token is invalid, clear everything
          dispatch(resetAuth());
        }
      }
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading screen while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        <span className="ml-3 text-gray-600">Initializing...</span>
      </div>
    );
  }

  return (
    <>
      <GlobalLoadingOverlay />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              <>
                <ClientNavbar />
                <Home />
              </>
            } 
          />
          <Route 
            path="/products/:id" 
            element={
              <>
                <ClientNavbar />
                <ProductDetails />
              </>
            } 
          />

          {/* Auth routes - only accessible when NOT authenticated */}
          <Route
            path="/admin/login"
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/admin">
                <AdminLogin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/admin">
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <>
                  <AdminNavbar />
                  <AdminDashboard />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <>
                  <AdminNavbar />
                  <AdminProducts />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute>
                <>
                  <AdminNavbar />
                  <InquiryDashboard />
                </>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;