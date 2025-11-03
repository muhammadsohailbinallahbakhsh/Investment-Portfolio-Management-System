import { UserRole } from '@/types';

export const isValidUserRole = (value: string): value is UserRole => {
  return Object.values(UserRole).includes(value as UserRole);
};

export * from './routeHelpers';
