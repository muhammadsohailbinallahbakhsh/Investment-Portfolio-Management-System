import type { UserRole } from './enums';

export type UserSliceType = {
  role: UserRole;
  name: string;
  email: string;
  profileUrl: string;
  dateJoined: string;
};
