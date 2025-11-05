import { NavLink, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components';
import { navLinksAdmin, navLinksUser } from '@/constants/data';
import images from '@/constants/images';
import { UserRole } from '@/types';
import type { SidebarPropsType } from '@/types';
import { useAuth } from '@/hooks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setUser } from '@/features/userSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Settings } from 'lucide-react';

const Sidebar = ({ role, onNavigate }: SidebarPropsType) => {
  const navLinks = [UserRole.Admin].includes(role)
    ? navLinksAdmin
    : navLinksUser;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  console.log('Sidebar rendering with role:', role);
  console.log('Using navLinks:', navLinks);

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
        dateJoined: new Date(),
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
    <nav className='flex flex-col h-full p-4 sm:p-6 text-dark-100 justify-between'>
      {/* Top section: Logo + Navigation */}
      <div>
        <div className='flex border-b border-light-100 pb-4 mb-4'>
          <Logo wrapperClasses='flex-center !justify-start gap-2' />
        </div>
        <ul className='flex flex-col gap-3'>
          {navLinks.map((navLink, idx) => (
            <NavLink key={idx} to={navLink.link} onClick={onNavigate}>
              {({ isActive }) => (
                <Button
                  className={`cursor-pointer px-3.5 py-3 sm:py-4 md:py-6 w-full justify-start rounded-[10px] p-18-regular ${
                    isActive
                      ? 'text-white bg-primary-100'
                      : 'text-gray-100 hover:bg-light-200'
                  }`}
                  variant={isActive ? 'default' : 'ghost'}
                >
                  <img
                    src={navLink.icon}
                    alt={navLink.lable}
                    className={`
                      ${isActive ? 'invert brightness-0' : ''} h-5 w-5 mr-3
                       `}
                  />
                  {navLink.lable}
                </Button>
              )}
            </NavLink>
          ))}
        </ul>
      </div>

      {/* User Profile Section at Bottom */}
      <div className='border-t border-light-100 pt-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='w-full justify-start px-3 py-3 hover:bg-light-200 rounded-[10px]'
            >
              <Avatar className='h-9 w-9 mr-3'>
                <AvatarFallback className='bg-primary-100 text-white text-sm'>
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-start text-left flex-1 min-w-0'>
                <p className='text-sm font-medium leading-none text-dark-100 truncate w-full'>
                  {user?.name || 'User'}
                </p>
                <p className='text-xs leading-none text-gray-500 mt-1 truncate w-full'>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='end' side='top'>
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
              onClick={() => {
                navigate('/profile');
                onNavigate?.();
              }}
              className='cursor-pointer'
            >
              <User className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate('/profile');
                onNavigate?.();
              }}
              className='cursor-pointer'
            >
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
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
      </div>
    </nav>
  );
};

export default Sidebar;
