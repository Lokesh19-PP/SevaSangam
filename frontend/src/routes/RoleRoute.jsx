import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * RoleRoute Component — SevaSangam
 * Role-Based Access Control (RBAC) route wrapper.
 * Ensures user only accesses dashboards/pages authorized for their role.
 */
const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 font-medium">Checking authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role;
  const isAuthorized = allowedRoles.includes(userRole);

  if (!isAuthorized) {
    // Redirect to user's authorized role dashboard, or home if unknown
    if (userRole === 'worker') {
      return <Navigate to="/worker" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'customer') {
      return <Navigate to="/customer" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;
