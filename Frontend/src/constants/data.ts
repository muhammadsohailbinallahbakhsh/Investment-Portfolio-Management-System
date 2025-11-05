import icons from './icons';
import type { NavLinkType } from '@/types';

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

export { navLinksAdmin, navLinksUser };
