// components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { checkAuthStatus } from '../store/slices/authSlice';
import { setLoading, clearLoading } from '../store/slices/loadingSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string | string[];
  fallbackPath?: string;
  loadingMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRole,
  fallbackPath,
  loadingMessage = 'Checking authentication...'
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { isLoading, loadingMessage: currentLoadingMessage } = useAppSelector((state) => state.loading);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (requireAuth && !isAuthenticated) {
        dispatch(setLoading({ isLoading: true, message: loadingMessage }));
        await dispatch(checkAuthStatus());
        dispatch(clearLoading());
      }
    };

    checkAuthentication();
  }, [dispatch, requireAuth, isAuthenticated, loadingMessage]);

  // Show loading while checking auth status
  if (isLoading && requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        {currentLoadingMessage && (
          <span className="ml-3 text-gray-600 mt-3">{currentLoadingMessage}</span>
        )}
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    const redirectPath = fallbackPath || '/admin/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requireAuth && requiredRole && user) {
    const userRole = user.role;
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      const accessDeniedPath = fallbackPath || '/admin/access-denied';
      return <Navigate to={accessDeniedPath} replace />;
    }
  }

  // If user is authenticated but trying to access login page
  if (!requireAuth && isAuthenticated) {
    const redirectPath = fallbackPath || '/admin';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Default props
ProtectedRoute.defaultProps = {
  requireAuth: true,
  fallbackPath: undefined,
  requiredRole: undefined,
  loadingMessage: 'Checking authentication...',
};

export default ProtectedRoute;