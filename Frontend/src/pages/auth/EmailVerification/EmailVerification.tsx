import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components';

const EmailVerification = () => {
  return (
    <main className='relative h-screen w-full bg-auth bg-no-repeat bg-cover bg-center overflow-y-auto overflow-x-hidden'>
      {/* Overlay */}
      <div className='absolute inset-0 bg-light-200/60 z-0' />

      {/* Centered Content */}
      <div className='relative z-10 flex items-center justify-center  px-4 sm:px-6 py-10'>
        <Card className='w-full max-w-[495px] bg-white shadow-xl/30 border border-light-100 rounded-[20px] px-[25px] py-10 shadow-600 text-center flex flex-col gap-6'>
          <CardHeader>
            <Logo wrapperClasses='flex-center gap-2' />
            <CardTitle className='p-28-semibold text-dark-100 mt-6 mb-2'>
              Verify Your Email
            </CardTitle>
            <CardDescription className='p-18-regular text-gray-100 leading-7'>
              Enter the verification code sent to your email address
              <span className='text-dark-100 font-medium'>
                example@email.com
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className='flex flex-col items-center gap-6'>
            {/* OTP Inputs */}
            <div className='flex justify-center gap-3'>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className='w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center text-lg font-medium text-dark-100 bg-white'
                >
                  {/* Replace with real inputs if needed */}
                  <span className='text-dark-100'>-</span>
                </div>
              ))}
            </div>

            {/* Resend Timer */}
            <p className='p-14-regular text-gray-100'>
              Didn't receive a code? (21s)
            </p>

            {/* Continue Button */}
            <Button className='w-full border border-light-100 rounded-[8px] shadow-100 py-5 px-4 p-18-regular leading-6 cursor-pointer bg-primary-100 text-white'>
              Continue
            </Button>
          </CardContent>

          <CardFooter className='justify-center mt-2'>
            <div className='flex items-center justify-center text-gray-100'>
              <span className='p-14-regular'>Secured by</span>
              <div className='ml-2 flex items-center space-x-1'>
                <div className='w-4 h-4 bg-dark-100 rounded-sm'></div>
                <span className='p-14-medium'>Clerk</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default EmailVerification;
