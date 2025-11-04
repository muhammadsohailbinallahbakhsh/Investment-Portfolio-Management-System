import { useState, useEffect } from 'react';
import { useUserProfile, useUpdateProfile } from '@/api';
import { useAuth } from '@/hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Mail, Save } from 'lucide-react';
import type { UpdateUserRequest } from '@/types';

const UserProfile = () => {
  const { user: authUser } = useAuth();
  const { data: profileData, isLoading: isLoadingProfile } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  // Profile form state
  const [profileForm, setProfileForm] = useState<UpdateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Initialize profile form when data loads
  useEffect(() => {
    if (profileData?.data) {
      setProfileForm({
        firstName: profileData.data.firstName || '',
        lastName: profileData.data.lastName || '',
        email: profileData.data.email || '',
      });
    }
  }, [profileData]);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleProfileInputChange = (
    field: keyof UpdateUserRequest,
    value: string
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the user ID from profile data
    const userId = profileData?.data?.id;
    if (!userId) {
      return;
    }

    updateProfileMutation.mutate({
      userId,
      data: profileForm,
    });
  };

  if (isLoadingProfile) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary-100' />
      </div>
    );
  }

  const user = profileData?.data;

  return (
    <div className='w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
        <Avatar className='w-20 h-20 border-4 border-primary-100'>
          <AvatarFallback className='bg-primary-100 text-white text-2xl font-semibold'>
            {getInitials(user?.firstName, user?.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <h1 className='p-32-bold text-dark-100'>
            {user?.firstName} {user?.lastName}
          </h1>
          <p className='p-16-regular text-gray-500 flex items-center gap-2 mt-1'>
            <Mail className='w-4 h-4' />
            {user?.email}
          </p>
          <div className='flex items-center gap-3 mt-2'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.role === 'Admin'
                  ? 'bg-primary-50 text-primary-500'
                  : 'bg-success-50 text-success-700'
              }`}
            >
              {user?.role}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.isActive
                  ? 'bg-success-50 text-success-700'
                  : 'bg-red-50 text-red-500'
              }`}
            >
              {user?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <Separator className='bg-light-400' />

      {/* Profile Information Card */}
      <Card className='shadow-100 border-light-400'>
        <CardHeader className='bg-light-300'>
          <CardTitle className='flex items-center gap-2 p-24-bold text-dark-100'>
            <User className='w-5 h-5 text-primary-100' />
            Profile Information
          </CardTitle>
          <CardDescription className='p-14-regular text-gray-500'>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <form onSubmit={handleUpdateProfile} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* First Name */}
              <div className='space-y-2'>
                <Label
                  htmlFor='firstName'
                  className='p-14-semibold text-dark-100'
                >
                  First Name
                </Label>
                <Input
                  id='firstName'
                  type='text'
                  value={profileForm.firstName}
                  onChange={(e) =>
                    handleProfileInputChange('firstName', e.target.value)
                  }
                  className='border-light-400 focus:border-primary-100 focus:ring-primary-100'
                  required
                />
              </div>

              {/* Last Name */}
              <div className='space-y-2'>
                <Label
                  htmlFor='lastName'
                  className='p-14-semibold text-dark-100'
                >
                  Last Name
                </Label>
                <Input
                  id='lastName'
                  type='text'
                  value={profileForm.lastName}
                  onChange={(e) =>
                    handleProfileInputChange('lastName', e.target.value)
                  }
                  className='border-light-400 focus:border-primary-100 focus:ring-primary-100'
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='p-14-semibold text-dark-100'>
                Email Address
              </Label>
              <Input
                id='email'
                type='email'
                value={profileForm.email}
                onChange={(e) =>
                  handleProfileInputChange('email', e.target.value)
                }
                className='border-light-400 focus:border-primary-100 focus:ring-primary-100'
              />
              <p className='p-12-regular text-gray-500'>
                Leave empty to keep current email
              </p>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end pt-4'>
              <Button
                type='submit'
                disabled={updateProfileMutation.isPending}
                className='bg-primary-100 hover:bg-primary-500 text-white px-6'
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className='w-4 h-4 mr-2' />
                    Update Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information (Read-only) */}
      <Card className='shadow-100 border-light-400'>
        <CardHeader className='bg-light-300'>
          <CardTitle className='p-24-bold text-dark-100'>
            Account Information
          </CardTitle>
          <CardDescription className='p-14-regular text-gray-500'>
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <p className='p-12-medium text-gray-500 uppercase tracking-wide mb-1'>
                Account Created
              </p>
              <p className='p-16-semibold text-dark-100'>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className='p-12-medium text-gray-500 uppercase tracking-wide mb-1'>
                Last Updated
              </p>
              <p className='p-16-semibold text-dark-100'>
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
