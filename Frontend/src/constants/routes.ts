// Route Constants
export const ROUTES = {
  // Auth Routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Public/User Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  // Portfolios
  PORTFOLIOS: {
    LIST: '/portfolios',
    DETAIL: (id: string) => `/portfolios/${id}`,
  },

  // Investments
  INVESTMENTS: {
    LIST: '/investments',
    ADD: '/investments/add',
    DETAIL: (id: string) => `/investments/${id}`,
    EDIT: (id: string) => `/investments/${id}/edit`,
  },

  // Transactions
  TRANSACTIONS: {
    LIST: '/transactions',
    ADD: '/transactions/add',
  },

  // Reports
  REPORTS: '/reports',

  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: {
      LIST: '/admin/users',
      DETAIL: (id: string) => `/admin/users/${id}`,
      EDIT: (id: string) => `/admin/users/${id}/edit`,
    },
  },

  // Error Routes
  FORBIDDEN: '/forbidden',
  NOT_FOUND: '*',
} as const;

// Navigation Menu Items
export interface NavItem {
  title: string;
  path: string;
  icon?: string;
  roles?: string[];
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
  },
  {
    title: 'Portfolios',
    path: ROUTES.PORTFOLIOS.LIST,
    icon: 'briefcase',
  },
  {
    title: 'Investments',
    path: ROUTES.INVESTMENTS.LIST,
    icon: 'trending-up',
  },
  {
    title: 'Transactions',
    path: ROUTES.TRANSACTIONS.LIST,
    icon: 'receipt',
  },
  {
    title: 'Reports',
    path: ROUTES.REPORTS,
    icon: 'bar-chart',
  },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Admin Dashboard',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: 'layout-dashboard',
    roles: ['Admin'],
  },
  {
    title: 'Users',
    path: ROUTES.ADMIN.USERS.LIST,
    icon: 'users',
    roles: ['Admin'],
  },
];
