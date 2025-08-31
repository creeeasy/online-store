import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks/redux';
import { checkAuthStatus } from './store/slices/authSlice';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminSubmissions from './pages/AdminSubmissions';
import ClientNavbar from './components/ClientNavbar';
import AdminNavbar from './components/AdminNavbar';
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay';
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route path="/" element={<><ClientNavbar /><Home /></>} />
          <Route path="/products/:id" element={<><ClientNavbar /><ProductDetails /></>} />
          
          <Route 
            path="/admin/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <AdminLogin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminNavbar />
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute>
                <AdminNavbar />
                <AdminProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/submissions" 
            element={
              <ProtectedRoute>
                <AdminNavbar />
                <AdminSubmissions />
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
      <AppContent />
    </Provider>
  );
};

export default App;