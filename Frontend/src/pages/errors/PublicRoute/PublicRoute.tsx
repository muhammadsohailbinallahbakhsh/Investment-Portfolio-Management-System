import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { UserRole } from '@/types';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo }) => {
  const { isAuthenticated, user } = useAuth();

  // If user is authenticated, redirect based on role
  if (isAuthenticated) {
    // If a specific redirectTo is provided, use it
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Otherwise, redirect based on user role
    const isAdmin = user?.role === UserRole.Admin;
    const defaultRedirect = isAdmin ? '/admin/dashboard' : '/dashboard';

    console.log('PublicRoute: User is authenticated');
    console.log('PublicRoute: User role:', user?.role);
    console.log('PublicRoute: Is admin?', isAdmin);
    console.log('PublicRoute: Redirecting to:', defaultRedirect);

    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
