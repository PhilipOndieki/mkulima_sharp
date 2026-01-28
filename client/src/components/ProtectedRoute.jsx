import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute Component
 * 
 * Wrapper component for routes that require authentication
 * Implements role-based access control
 * 
 * Security Features:
 * - Authentication verification
 * - Role-based access control
 * - Permission checking
 * - Secure redirect handling
 * - Loading states
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Protected content
 * @param {string} props.requiredRole - Required user role (optional)
 * @param {string} props.requiredPermission - Required permission (optional)
 * @param {string} props.redirectTo - Redirect path if unauthorized (default: '/login')
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredPermission = null,
  redirectTo = '/login'
}) => {
  const location = useLocation();
  const { 
    isAuthenticated, 
    hasRole, 
    checkPermission, 
    loading, 
    initializing,
    user
  } = useAuth();

  // Show loading state while checking authentication
  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login with return path
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access if required
  if (requiredRole && !hasRole(requiredRole)) {
    console.warn('[ProtectedRoute] Access denied: Insufficient role', {
      requiredRole,
      userRole: user?.role
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-card p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary inline-block"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check permission-based access if required
  if (requiredPermission && !checkPermission(requiredPermission)) {
    console.warn('[ProtectedRoute] Access denied: Insufficient permission', {
      requiredPermission,
      userRole: user?.role
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-card p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Permission Required
          </h2>
          <p className="text-gray-600 mb-6">
            This feature requires additional permissions. Please contact your administrator.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary inline-block"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render protected content
  return children;
};

/**
 * AdminRoute Component
 * Convenience wrapper for admin-only routes
 */
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
};

/**
 * DispatcherRoute Component
 * Convenience wrapper for dispatcher-level routes
 */
export const DispatcherRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="dispatcher">
      {children}
    </ProtectedRoute>
  );
};

/**
 * DriverRoute Component
 * Convenience wrapper for driver-level routes
 */
export const DriverRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="driver">
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;