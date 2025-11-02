import icons from '@/constants/icons';

const Logo = ({
  wrapperClasses,
  textClasses,
}: {
  wrapperClasses: string;
  textClasses?: string;
}) => {
  return (
    <div className={wrapperClasses}>
      <img src={icons.logoIcon} alt='IPMS Logo' />
      <span
        className={`${textClasses || 'p-28-bold'}
          font-jakarta text-dark-100 lg:leading-7`}
      >
        IPMS
      </span>
    </div>
  );
};

export default Logo;
