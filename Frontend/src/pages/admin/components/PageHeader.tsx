import icons from '@/constants/icons';
import { Button } from '@/components/ui/button';
import type { PageHeaderPropsType } from '@/types';

const PageHeader = ({
  heading,
  subHeading,
  buttonCaption,
  shouldDisableButton,
}: PageHeaderPropsType) => {
  return (
    <header className='w-full flex flex-col gap-4 items-start justify-between md:flex-row md:items-center md:h-[67px]'>
      {/* Text */}
      <div>
        <h3 className='p-28-semibold text-dark-100 mb-2'>{heading}</h3>
        <p className='p-18-regular text-gray-100'>{subHeading}</p>
      </div>

      {/* Button - Only render if buttonCaption is provided */}
      {buttonCaption && (
        <Button
          className='w-full md:w-auto flex items-center gap-2 border-2 border-light-100 shadow-100 rounded-[8px] py-5 px-4'
          disabled={shouldDisableButton}
        >
          <img src={icons.plusIcon} alt='Add' />
          {buttonCaption}
        </Button>
      )}
    </header>
  );
};

export default PageHeader;
