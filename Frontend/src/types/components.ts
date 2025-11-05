import { UserRole } from './enums';

type SidebarPropsType = {
  role: UserRole;
  onNavigate?: () => void;
};

type NavbarPropsType = {
  currentPath?: string;
  isAdmin: boolean;
  toggleSidebar: (value: React.SetStateAction<boolean>) => void;
};

type DashboardStatsType = {
  caption: string;
  count: number;
  percentage: number;
  icon: string;
  arrow: string;
};

type NavLinkType = { lable: string; icon: string; link: string };

type PageHeaderPropsType = {
  heading: string;
  subHeading: string;
  buttonCaption?: string;
  shouldDisableButton?: boolean;
};

type StatCardPropsType = {
  caption: string;
  count: number;
  percentage: number;
  icon: string;
  arrow: string;
};

export type {
  SidebarPropsType,
  NavbarPropsType,
  DashboardStatsType,
  NavLinkType,
  PageHeaderPropsType,
  StatCardPropsType,
};
