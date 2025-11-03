import { useMemo } from 'react';
import { useAuth } from '@/contexts';
import { UserRole } from '@/types';

export const useRole = () => {
  const { user } = useAuth();

  const isAdmin = useMemo(() => user?.role === UserRole.Admin, [user]);
  const isUser = useMemo(() => user?.role === UserRole.User, [user]);

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return {
    role: user?.role,
    isAdmin,
    isUser,
    hasRole,
  };
};
