import { Button } from '@/components/ui/button';
import { Logo } from '@/components';
import icons from '@/constants/icons';
import { useAuth } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setUser } from '@/features/userSlice';
import { UserRole } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';

import type { NavbarPropsType } from '@/types/components';

const Navbar = ({ isAdmin, toggleSidebar }: NavbarPropsType) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear auth context
    logout();

    // Reset Redux store to default guest user
    dispatch(
      setUser({
        name: 'Guest User',
        email: '',
        role: UserRole.User,
        profileUrl: '',
        dateJoined: new Date().toISOString(),
      })
    );

    navigate('/auth/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <header
      className={`w-full bg-white border-b border-light-100 sticky top-0 z-30 px-4 sm:px-6 py-4 flex items-center justify-between ${
        isAdmin ? ' lg:hidden ' : ' md:px-10 lg:px-20 '
      }`}
    >
      <Logo
        wrapperClasses='flex-center !justify-start gap-2'
        textClasses='p-24-bold'
      />
      <div className='flex items-center gap-4'>
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
              <Avatar className='h-10 w-10'>
                <AvatarFallback className='bg-primary-100 text-white'>
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{user?.name}</p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/profile')}
              className='cursor-pointer'
            >
              <User className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className='cursor-pointer text-red-600'
            >
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu Toggle Button */}
        <Button
          variant='ghost'
          className='p-2 cursor-pointer'
          onClick={() => toggleSidebar((prev) => !prev)}
        >
          <img src={icons.menuIcon} alt='Menu' className='w-6 h-6' />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
