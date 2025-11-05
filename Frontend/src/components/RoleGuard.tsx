import type { ReactNode } from 'react';
import { useRole } from '@/hooks';
import type { UserRole } from '@/types';

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
};

/**
 * RoleGuard component to conditionally render content based on user roles
 * Use this for UI elements that should only be visible to certain roles
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const { hasRole } = useRole();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
