import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { UserRole } from '@/types';

interface UseAppNavigationReturn {
  navigateToDashboard: () => void;
  navigateToLogin: () => void;
  navigateBack: () => void;
  isCurrentPath: (path: string) => boolean;
  getDashboardPath: () => string;
}

export const useAppNavigation = (): UseAppNavigationReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (user?.role === UserRole.Admin) {
      return '/admin/dashboard';
    }
    return '/dashboard';
  };

  const navigateToDashboard = () => {
    navigate(getDashboardPath());
  };

  const navigateToLogin = () => {
    navigate('/auth/login', { state: { from: location } });
  };

  const navigateBack = () => {
    navigate(-1);
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  return {
    navigateToDashboard,
    navigateToLogin,
    navigateBack,
    isCurrentPath,
    getDashboardPath,
  };
};
