import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logo } from '@/components';
import { useResetPassword } from '@/api/mutations';

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
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains number', met: /[0-9]/.test(formData.password) },
    {
      text: 'Contains special character',
      met: /[!@#$%^&*]/.test(formData.password),
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain an uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain a number';
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must contain a special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetPasswordMutation = useResetPassword({
    onSuccess: () => {
      navigate('/auth/login', { replace: true });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token || !email) {
      toast.error('Invalid or expired reset link');
      return;
    }

    resetPasswordMutation.mutate({
      email,
      token,
      newPassword: formData.password,
    });
  };

  const isLoading = resetPasswordMutation.isPending;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Check if we have valid token and email
  if (!token || !email) {
    return (
      <main className='relative min-h-screen w-full bg-light-200 flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-8'>
        <Card className='w-full max-w-md bg-white shadow-lg border border-light-400 rounded-20 p-6 sm:p-8'>
          <CardHeader className='space-y-4 text-center'>
            <CardTitle className='p-28-bold text-dark-100'>
              Invalid Reset Link
            </CardTitle>
            <CardDescription className='p-16-regular text-gray-500'>
              This password reset link is invalid or has expired. Please request
              a new one.
            </CardDescription>
          </CardHeader>

          <CardContent className='mt-6'>
            <Button
              onClick={() => navigate('/auth/forgot-password')}
              className='w-full bg-primary-100 hover:bg-primary-500 text-white py-3 rounded-lg p-16-semibold'
            >
              Request New Link
            </Button>
          </CardContent>

          <CardFooter className='flex justify-center mt-6'>
            <Link
              to='/auth/login'
              className='text-primary-100 hover:text-primary-500 p-14-medium'
            >
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
            Set New Password
          </CardTitle>
          <CardDescription className='p-16-regular text-gray-500 text-center'>
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4 mt-6'>
            {/* Password Field */}
            <div className='space-y-2'>
              <Label htmlFor='password' className='p-14-medium text-dark-100'>
                New Password
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Create a strong password'
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
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

              {/* Password Requirements */}
              {formData.password && (
                <div className='space-y-1 mt-2'>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <CheckCircle2
                        size={14}
                        className={`${
                          req.met ? 'text-success-500' : 'text-gray-300'
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          req.met ? 'text-success-700' : 'text-gray-500'
                        }`}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className='space-y-2'>
              <Label
                htmlFor='confirmPassword'
                className='p-14-medium text-dark-100'
              >
                Confirm New Password
              </Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Re-enter your password'
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  className={`pr-10 ${
                    errors.confirmPassword ? 'border-destructive' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm text-destructive'>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full bg-primary-100 hover:bg-primary-500 text-white py-3 rounded-lg p-16-semibold mt-4'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </CardContent>

          <CardFooter className='flex justify-center mt-6'>
            <Link
              to='/auth/login'
              className='text-primary-100 hover:text-primary-500 p-14-medium'
            >
              Back to Sign In
            </Link>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default PasswordReset;
