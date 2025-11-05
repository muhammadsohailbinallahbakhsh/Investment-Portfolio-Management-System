import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';
import type { UserRole } from '@/types';

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
};

export default function ProtectedRoute({
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to='/auth/login' replace state={{ from: location }} />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to='/forbidden' replace />;
  }

  return <Outlet />;
}
