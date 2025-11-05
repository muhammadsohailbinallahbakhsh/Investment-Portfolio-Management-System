import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { UserRole } from '@/types';

type PublicRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export default function PublicRoute({
  children,
  redirectTo,
}: PublicRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    const isAdmin = user?.role === UserRole.Admin;
    const defaultRedirect = isAdmin ? '/admin/dashboard' : '/dashboard';

    console.log('PublicRoute: User is authenticated');
    console.log('PublicRoute: User role:', user?.role);
    console.log('PublicRoute: Is admin?', isAdmin);
    console.log('PublicRoute: Redirecting to:', defaultRedirect);

    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
}
