// components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router';

// Dummy auth hook or props — replace with your real auth logic
const useAuth = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return {
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};

const ProtectedRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/auth/admin' replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to='/forbidden' replace />;
  }

  return <Outlet />; // continue to nested routes
};

export default ProtectedRoute;
