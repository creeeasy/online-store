// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string | string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo,
}) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Case 1: Route requires authentication but user is NOT authenticated
  if (requireAuth && !isAuthenticated) {
    const loginPath = redirectTo || '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Case 2: Route does NOT require authentication but user IS authenticated
  // (e.g., login/register pages when already logged in)
  if (!requireAuth && isAuthenticated) {
    const dashboardPath = redirectTo || '/admin';
    return <Navigate to={dashboardPath} replace />;
  }

  // Case 3: Check role-based access (only if authenticated and role is required)
  if (requireAuth && isAuthenticated && requiredRole && user) {
    const userRole = user.role;
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      // You can create an access denied page or redirect to dashboard
      return <Navigate to="/admin" replace />;
    }
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;