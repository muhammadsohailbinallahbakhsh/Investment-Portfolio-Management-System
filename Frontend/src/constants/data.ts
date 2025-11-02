import icons from './icons';
import type { DashboardStatsType, NavLinkType } from '@/types';

const dashboardStats: DashboardStatsType[] = [
  {
    caption: 'Total Users',
    count: 12450,
    percentage: 12,
    icon: icons.incrementIcon,
    arrow: icons.arrowUpGreenIcon,
  },
  {
    caption: 'Total Portfolios',
    count: 3210,
    percentage: 2,
    icon: icons.decrementIcon,
    arrow: icons.arrowDownRedIcon,
  },
  {
    caption: 'Active Users Today',
    count: 520,
    percentage: 2,
    icon: icons.incrementIcon,
    arrow: icons.arrowUpGreenIcon,
  },
];

// Admin Navigation
const navLinksAdmin: NavLinkType[] = [
  { lable: 'Dashboard', icon: icons.homeIcon, link: '/admin/dashboard' },
  { lable: 'Users', icon: icons.usersIcon, link: '/admin/users' },
  {
    lable: 'Investments',
    icon: icons.homeIcon,
    link: '/admin/investments',
  },
  {
    lable: 'Transactions',
    icon: icons.homeIcon,
    link: '/admin/transactions',
  },
  { lable: 'Reports', icon: icons.homeIcon, link: '/admin/reports' },
  {
    lable: 'Activity Log',
    icon: icons.homeIcon,
    link: '/admin/activity-log',
  },
];

// User Navigation
const navLinksUser: NavLinkType[] = [
  { lable: 'Dashboard', icon: icons.homeIcon, link: '/dashboard' },
  { lable: 'Investments', icon: icons.homeIcon, link: '/investments' },
  { lable: 'Transactions', icon: icons.homeIcon, link: '/transactions' },
  { lable: 'Reports', icon: icons.homeIcon, link: '/reports' },
  { lable: 'Profile', icon: icons.homeIcon, link: '/profile' },
];

export { navLinksAdmin, navLinksUser, dashboardStats };
