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
    lable: 'Activity Logs',
    icon: icons.itineraryIcon,
    link: '/admin/activity-logs',
  },
  { lable: 'Profile', icon: icons.usersIcon, link: '/profile' },
];

// User Navigation
const navLinksUser: NavLinkType[] = [
  { lable: 'Dashboard', icon: icons.homeIcon, link: '/dashboard' },
  { lable: 'Portfolios', icon: icons.groupIcon, link: '/portfolios' },
  { lable: 'Investments', icon: icons.incrementIcon, link: '/investments' },
  { lable: 'Transactions', icon: icons.itineraryIcon, link: '/transactions' },
  { lable: 'Reports', icon: icons.discoverIcon, link: '/reports' },
  { lable: 'Profile', icon: icons.usersIcon, link: '/profile' },
];

export { navLinksAdmin, navLinksUser, dashboardStats };
