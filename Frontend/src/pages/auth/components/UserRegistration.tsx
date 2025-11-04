import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { toast } from 'react-toastify';
import { Logo } from '@/components';
import { useRegister } from '@/api/mutations';

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
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const UserRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

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

  const registerMutation = useRegister({
    onSuccess: (response) => {
      if (response.success && response.data) {
        const userData = response.data;

        // Store tokens
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('refreshToken', userData.refreshToken);

        // Update auth context
        login({
          id: userData.userId,
          name: `${formData.firstName} ${formData.lastName}`,
          email: userData.email,
          role: userData.role as any,
        });

        toast.success('Registration successful! Welcome aboard!');
        navigate('/dashboard', { replace: true });
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    registerMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });
  };

  const isLoading = registerMutation.isPending;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <main className='relative min-h-screen w-full bg-light-200 flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-8'>
      <Card className='w-full max-w-md bg-white shadow-lg border border-light-400 rounded-20 p-6 sm:p-8'>
        <CardHeader className='space-y-4'>
          <Logo wrapperClasses='flex-center gap-2' />
          <CardTitle className='p-30-bold text-dark-100 text-center'>
            Create Account
          </CardTitle>
          <CardDescription className='p-16-regular text-gray-500 text-center'>
            Join us to start managing your investments
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4 mt-6'>
            {/* First Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='firstName' className='p-14-medium text-dark-100'>
                First Name
              </Label>
              <Input
                id='firstName'
                type='text'
                placeholder='John'
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`${errors.firstName ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className='text-sm text-destructive'>{errors.firstName}</p>
              )}
            </div>

            {/* Last Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='lastName' className='p-14-medium text-dark-100'>
                Last Name
              </Label>
              <Input
                id='lastName'
                type='text'
                placeholder='Doe'
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`${errors.lastName ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className='text-sm text-destructive'>{errors.lastName}</p>
              )}
            </div>

            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='p-14-medium text-dark-100'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`${errors.email ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className='text-sm text-destructive'>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <Label htmlFor='password' className='p-14-medium text-dark-100'>
                Password
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
                Confirm Password
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

            {/* Terms and Conditions */}
            <div className='flex items-start space-x-2 pt-2'>
              <input
                type='checkbox'
                id='terms'
                className='w-4 h-4 mt-1 rounded border-gray-300'
                required
              />
              <Label
                htmlFor='terms'
                className='p-14-regular text-gray-700 cursor-pointer'
              >
                I agree to the{' '}
                <Link to='/terms' className='text-primary-100 hover:underline'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to='/privacy'
                  className='text-primary-100 hover:underline'
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type='submit'
              className='w-full bg-primary-100 hover:bg-primary-500 text-white py-3 rounded-lg p-16-semibold mt-4'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4 mt-6'>
            <div className='text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <Link
                to='/auth/login'
                className='text-primary-100 hover:text-primary-500 font-medium'
              >
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default UserRegistration;
