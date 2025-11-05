import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { toast } from 'react-toastify';
import { Logo } from '@/components';
import { useLogin } from '@/api/mutations';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setUser } from '@/features/userSlice';
import { UserRole } from '@/types';

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
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Demo credentials from backend seeder
const demoCredentials = {
  user: { email: 'user1@portfolio.com', password: 'User@123' },
  admin: { email: 'admin@portfolio.com', password: 'Admin@123' },
};

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginMutation = useLogin({
    onSuccess: (response) => {
      if (response.success && response.data) {
        const userData = response.data;

        console.log('Login response data:', userData);
        console.log('User role from backend:', userData.role);
        console.log('Role type:', typeof userData.role);
        console.log('Is Admin?', userData.role === 'Admin');

        // Store tokens
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('refreshToken', userData.refreshToken);

        // Update auth context
        login({
          id: userData.userId,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: userData.role as any,
        });

        // Update Redux store with user role
        dispatch(
          setUser({
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            role: userData.role === 'Admin' ? UserRole.Admin : UserRole.User,
            profileUrl: '',
            dateJoined: new Date(),
          })
        );

        toast.success('Login successful!');

        // Navigate based on role - Check role before navigation
        const targetPath =
          userData.role === 'Admin' ? '/admin/dashboard' : from;
        console.log('Navigating to:', targetPath);

        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          navigate(targetPath, { replace: true });
          console.log('Navigation complete to:', targetPath);
        }, 100);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate({
      email,
      password,
    });
  };

  const isLoading = loginMutation.isPending;

  const handleDemoLogin = async (type: 'user' | 'admin') => {
    const credentials =
      type === 'admin' ? demoCredentials.admin : demoCredentials.user;
    setEmail(credentials.email);
    setPassword(credentials.password);

    // Trigger login after a brief delay
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 100);
  };

  return (
    <main className='relative min-h-screen w-full bg-light-200 flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-8'>
      <Card className='w-full max-w-md bg-white shadow-lg border border-light-400 rounded-20 p-6 sm:p-8'>
        <CardHeader className='space-y-4'>
          <Logo wrapperClasses='flex-center gap-2' />
          <CardTitle className='p-30-bold text-dark-100 text-center'>
            Welcome Back
          </CardTitle>
          <CardDescription className='p-16-regular text-gray-500 text-center'>
            Sign in to manage your investment portfolio
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4 mt-6'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='p-14-medium text-dark-100'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='admin@portfolio.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`${errors.email ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className='text-sm text-destructive'>{errors.email}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='p-14-medium text-dark-100'>
                Password
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`pr-10 ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-sm text-destructive'>{errors.password}</p>
              )}
            </div>

            <div className='flex items-center justify-end'>
              <Link
                to='/auth/forgot-password'
                className='p-14-medium text-primary-100 hover:text-primary-500'
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type='submit'
              className='w-full bg-primary-100 hover:bg-primary-500 text-white py-3 rounded-lg p-16-semibold'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className='relative flex items-center justify-center text-sm text-gray-500 my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-light-400'></div>
              </div>
              <span className='relative bg-white px-4 text-xs uppercase'>
                Demo Credentials
              </span>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
                className='w-full py-2.5 rounded-lg p-14-medium border-light-400 hover:bg-light-300'
              >
                User Demo
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className='w-full py-2.5 rounded-lg p-14-medium border-light-400 hover:bg-light-300'
              >
                Admin Demo
              </Button>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4 mt-6'>
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

export default UserLogin;
