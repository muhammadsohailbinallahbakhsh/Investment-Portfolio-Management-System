import { Button } from '@/components/ui/button';
import { Logo } from '@/components';
import icons from '@/constants/icons';
import images from '@/constants/images';
// import { UserProfileCard } from '@/components';

import type { NavbarPropsType } from '@/types/components';

const Navbar = ({ isAdmin, toggleSidebar }: NavbarPropsType) => {
  return (
    <header
      className={`w-full bg-white border-b border-light-100 sticky top-0 z-30 px-4 sm:px-6  py-5 flex items-center justify-between ${
        isAdmin ? ' lg:hidden ' : ' md:px-10 lg:px-20 '
      }`}
    >
      <Logo
        wrapperClasses='flex-center !justify-start gap-2'
        textClasses='p-24-bold'
      />
      <div className='flex-center gap-10'>
        {/* <UserProfileCard
          name='Maksudur Rahman'
          email='maksudur@example.com'
          avatarUrl={images.davidImg}
          joinedDate='2/6/23'
          isSidebar={false}
        /> */}
        <Button
          variant='ghost'
          className='p-2 cursor-pointer'
          onClick={() => toggleSidebar((prev) => !prev)}
        >
          <img src={icons.menuIcon} alt='Hamburger menu' className='w-8 h-8' />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
