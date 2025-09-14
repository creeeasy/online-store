// components/ProtectedRoute.tsx (Fixed version)
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { checkAuthStatus } from '../store/slices/authSlice';
import { setLoading, clearLoading } from '../store/slices/loadingSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string | string[];
  redirectTo?: string;
  loadingMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRole,
  redirectTo,
  loadingMessage = 'Checking authentication...'
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { isLoading: globalLoading, loadingMessage: currentLoadingMessage } = useAppSelector((state) => state.loading);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (requireAuth && !isAuthenticated && !authLoading) {
        dispatch(setLoading({ isLoading: true, message: loadingMessage }));
        await dispatch(checkAuthStatus());
        dispatch(clearLoading());
      }
    };

    checkAuthentication();
  }, [dispatch, requireAuth, isAuthenticated, authLoading, loadingMessage]);

  // Show loading while checking auth status
  if ((globalLoading || authLoading) && requireAuth) {
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
    const fallbackPath = redirectTo || '/admin/login';
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If authentication is NOT required but user IS authenticated (login/register pages)
  if (!requireAuth && isAuthenticated) {
    const fallbackPath = redirectTo || '/admin';
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role-based access (only if authenticated and role is required)
  if (requireAuth && isAuthenticated && requiredRole && user) {
    const userRole = user.role;
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      const accessDeniedPath = redirectTo || '/admin/access-denied';
      return <Navigate to={accessDeniedPath} replace />;
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;