import { UserRole } from '@/types';

/**
 * Route helper utilities
 */

/**
 * Check if a route requires admin access
 */
export const isAdminRoute = (path: string): boolean => {
  return path.startsWith('/admin');
};

/**
 * Check if a route is a public auth route
 */
export const isAuthRoute = (path: string): boolean => {
  return path.startsWith('/auth');
};

/**
 * Check if a route is an error route
 */
export const isErrorRoute = (path: string): boolean => {
  return ['/forbidden', '/not-found'].includes(path);
};

/**
 * Get the appropriate redirect path based on user role
 */
export const getRedirectPath = (role?: UserRole): string => {
  if (role === UserRole.Admin) {
    return '/admin/dashboard';
  }
  return '/dashboard';
};

/**
 * Check if user has permission to access a route
 */
export const canAccessRoute = (path: string, userRole?: UserRole): boolean => {
  if (!userRole) return false;

  // Admin routes are only accessible to admins
  if (isAdminRoute(path)) {
    return userRole === UserRole.Admin;
  }

  // All other protected routes are accessible to authenticated users
  return true;
};

/**
 * Extract route parameters from a path
 * Example: extractRouteParams('/investments/123', '/investments/:id') => { id: '123' }
 */
export const extractRouteParams = (
  actualPath: string,
  routePattern: string
): Record<string, string> => {
  const actualParts = actualPath.split('/').filter(Boolean);
  const patternParts = routePattern.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = actualParts[index];
    }
  });

  return params;
};

/**
 * Build a route with parameters
 * Example: buildRoute('/investments/:id', { id: '123' }) => '/investments/123'
 */
export const buildRoute = (
  pattern: string,
  params: Record<string, string | number>
): string => {
  let route = pattern;
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, String(value));
  });
  return route;
};
