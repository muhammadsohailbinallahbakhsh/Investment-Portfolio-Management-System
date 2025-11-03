/**
 * Example Usage of Routing and Authentication System
 *
 * This file demonstrates how to use the routing, authentication,
 * and role-based access control features in your components.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useRole, useAppNavigation } from '@/hooks';
import { RoleGuard } from '@/components';
import { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { canAccessRoute, buildRoute } from '@/utils';

/**
 * Example 1: Basic Authentication Check
 */
export const AuthExample = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
          <Button onClick={logout}>Logout</Button>
        </div>
      ) : (
        <div>
          <p>Please log in</p>
        </div>
      )}
    </div>
  );
};

/**
 * Example 2: Role-Based UI Rendering
 */
export const RoleBasedUIExample = () => {
  const { isAdmin, hasRole } = useRole();
  const navigate = useNavigate();

  return (
    <div>
      {/* Show to all authenticated users */}
      <Button onClick={() => navigate(ROUTES.DASHBOARD)}>My Dashboard</Button>

      {/* Show only to admins using hook */}
      {isAdmin && (
        <Button onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}>
          Admin Dashboard
        </Button>
      )}

      {/* Show only to admins using RoleGuard component */}
      <RoleGuard allowedRoles={[UserRole.Admin]}>
        <Button onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}>
          Manage Users
        </Button>
      </RoleGuard>

      {/* Show with fallback */}
      <RoleGuard
        allowedRoles={[UserRole.Admin]}
        fallback={<p>Admin access required</p>}
      >
        <Button>Admin Only Button</Button>
      </RoleGuard>

      {/* Check multiple roles */}
      {hasRole([UserRole.Admin, UserRole.User]) && (
        <Button>Available to both roles</Button>
      )}
    </div>
  );
};

/**
 * Example 3: Navigation Helpers
 */
export const NavigationExample = () => {
  const {
    navigateToDashboard,
    navigateToLogin,
    navigateBack,
    isCurrentPath,
    getDashboardPath,
  } = useAppNavigation();

  return (
    <div>
      <Button onClick={navigateToDashboard}>Go to My Dashboard</Button>

      <Button onClick={navigateBack}>Go Back</Button>

      <Button onClick={navigateToLogin}>Go to Login</Button>

      <p>Dashboard Path: {getDashboardPath()}</p>

      {isCurrentPath('/dashboard') && <p>You are on the dashboard</p>}
    </div>
  );
};

/**
 * Example 4: Using Route Constants
 */
export const RouteConstantsExample = () => {
  const navigate = useNavigate();

  const handleViewInvestment = (investmentId: string) => {
    // Using ROUTES constants with dynamic params
    navigate(ROUTES.INVESTMENTS.DETAIL(investmentId));
  };

  const handleEditInvestment = (investmentId: string) => {
    navigate(ROUTES.INVESTMENTS.EDIT(investmentId));
  };

  const handleViewUser = (userId: string) => {
    navigate(ROUTES.ADMIN.USERS.DETAIL(userId));
  };

  return (
    <div>
      <Button onClick={() => handleViewInvestment('123')}>
        View Investment 123
      </Button>

      <Button onClick={() => handleEditInvestment('123')}>
        Edit Investment 123
      </Button>

      <Button onClick={() => handleViewUser('456')}>
        View User 456 (Admin Only)
      </Button>

      <Button onClick={() => navigate(ROUTES.INVESTMENTS.ADD)}>
        Add New Investment
      </Button>
    </div>
  );
};

/**
 * Example 5: Route Utilities
 */
export const RouteUtilitiesExample = () => {
  const { user } = useAuth();

  // Check if user can access a route
  const canAccessAdmin = canAccessRoute('/admin/dashboard', user?.role);

  // Build route with parameters
  const investmentRoute = buildRoute(ROUTES.INVESTMENTS.DETAIL(':id'), {
    id: '123',
  });

  return (
    <div>
      <p>Can access admin? {canAccessAdmin ? 'Yes' : 'No'}</p>
      <p>Built route: {investmentRoute}</p>
    </div>
  );
};

/**
 * Example 6: Programmatic Login/Logout
 */
export const LoginLogoutExample = () => {
  const { login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    // After successful API call, store user data
    const userData = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.User,
      token: 'jwt-token-here',
      refreshToken: 'refresh-token-here',
    };

    login(userData);
    // User will be automatically redirected by routing logic
  };

  const handleLogout = () => {
    logout();
    // User will be redirected to login page
  };

  return (
    <div>
      {!isAuthenticated ? (
        <Button onClick={handleLogin}>Login</Button>
      ) : (
        <Button onClick={handleLogout}>Logout</Button>
      )}
    </div>
  );
};

/**
 * Example 7: Conditional Page Rendering
 */
export const ConditionalPageExample = () => {
  const { isAdmin } = useRole();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome to your dashboard</h1>

      {isAdmin ? (
        <div>
          <h2>Admin Features</h2>
          <p>You have access to user management</p>
        </div>
      ) : (
        <div>
          <h2>User Features</h2>
          <p>Manage your investments</p>
        </div>
      )}
    </div>
  );
};
