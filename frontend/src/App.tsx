// App.tsx (Fixed version)
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks/redux';
import { checkAuthStatus } from './store/slices/authSlice';
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

// Create QueryClient instance
const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <>
      <GlobalLoadingOverlay />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><ClientNavbar /><Home /></>} />
          <Route path="/products/:id" element={<><ClientNavbar /><ProductDetails /></>} />
          
          {/* Auth routes - redirect to /admin if already authenticated */}
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
              <ProtectedRoute redirectTo="/admin/login">
                <AdminNavbar />
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute redirectTo="/admin/login">
                <AdminNavbar />
                <AdminProducts />
              </ProtectedRoute>
            }
          />
       
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute redirectTo="/admin/login">
                <AdminNavbar />
                <InquiryDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;