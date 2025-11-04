import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logo } from '@/components';
import { useForgotPassword } from '@/api/mutations';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const forgotPasswordMutation = useForgotPassword({
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    forgotPasswordMutation.mutate({ email });
  };

  const isLoading = forgotPasswordMutation.isPending;

  if (isSubmitted) {
    return (
      <main className='relative min-h-screen w-full bg-light-200 flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-8'>
        <Card className='w-full max-w-md bg-white shadow-lg border border-light-400 rounded-20 p-6 sm:p-8'>
          <CardHeader className='space-y-4 text-center'>
            <div className='flex justify-center'>
              <div className='w-16 h-16 bg-success-50 rounded-full flex items-center justify-center'>
                <Mail className='w-8 h-8 text-success-500' />
              </div>
            </div>
            <CardTitle className='p-28-bold text-dark-100'>
              Check Your Email
            </CardTitle>
            <CardDescription className='p-16-regular text-gray-500'>
              We've sent password reset instructions to{' '}
              <span className='font-semibold text-dark-100'>{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4 mt-6'>
            <div className='bg-light-300 border border-light-400 rounded-lg p-4'>
              <p className='p-14-regular text-gray-700'>
                <strong>Didn't receive the email?</strong>
              </p>
              <ul className='list-disc list-inside p-14-regular text-gray-600 mt-2 space-y-1'>
                <li>Check your spam folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes and try again</li>
              </ul>
            </div>

            <Button
              onClick={() => setIsSubmitted(false)}
              variant='outline'
              className='w-full py-3 rounded-lg p-16-medium border-light-400 hover:bg-light-300'
            >
              Resend Email
            </Button>
          </CardContent>

          <CardFooter className='flex justify-center mt-6'>
            <Link
              to='/auth/login'
              className='flex items-center gap-2 text-primary-100 hover:text-primary-500 p-14-medium'
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className='relative min-h-screen w-full bg-light-200 flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-8'>
      <Card className='w-full max-w-md bg-white shadow-lg border border-light-400 rounded-20 p-6 sm:p-8'>
        <CardHeader className='space-y-4'>
          <Logo wrapperClasses='flex-center gap-2' />
          <CardTitle className='p-30-bold text-dark-100 text-center'>
            Reset Password
          </CardTitle>
          <CardDescription className='p-16-regular text-gray-500 text-center'>
            Enter your email address and we'll send you instructions to reset
            your password
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4 mt-6'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='p-14-medium text-dark-100'>
                Email Address
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='your.email@example.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`${error ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {error && <p className='text-sm text-destructive'>{error}</p>}
            </div>

            <Button
              type='submit'
              className='w-full bg-primary-100 hover:bg-primary-500 text-white py-3 rounded-lg p-16-semibold'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Sending...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4 mt-6'>
            <Link
              to='/auth/login'
              className='flex items-center justify-center gap-2 text-primary-100 hover:text-primary-500 p-14-medium'
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>

            <div className='text-center text-sm text-gray-500'>
              Don't have an account?{' '}
              <Link
                to='/auth/register'
                className='text-primary-100 hover:text-primary-500 font-medium'
              >
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default PasswordResetRequest;
