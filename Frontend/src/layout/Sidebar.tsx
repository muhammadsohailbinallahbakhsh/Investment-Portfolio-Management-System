import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components';
import { navLinksAdmin, navLinksUser } from '@/constants/data';
import images from '@/constants/images';
import { UserRole } from '@/types';
import type { SidebarPropsType } from '@/types';

const Sidebar = ({ role, onNavigate }: SidebarPropsType) => {
  const navLinks = [UserRole.Admin].includes(role)
    ? navLinksAdmin
    : navLinksUser;

  return (
    <nav className='flex flex-col h-full p-4 sm:p-6 text-dark-100 justify-between'>
      {/* Top section: Logo + Navigation */}
      <div>
        <div className='flex border-b border-light-100 pb-4 mb-4'>
          <Logo wrapperClasses='flex-center !justify-start gap-2' />
        </div>
        <ul className='flex flex-col gap-3'>
          {navLinks.map((navLink, idx) => (
            <NavLink key={idx} to={`/${navLink.link}`} onClick={onNavigate}>
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
      {/* <UserProfileCard
        name='Maksudur Rahman'
        email='maksudur@example.com'
        avatarUrl={images.davidImg}
        joinedDate='2/6/23'
        isSidebar={true}
      /> */}
    </nav>
  );
};

export default Sidebar;
