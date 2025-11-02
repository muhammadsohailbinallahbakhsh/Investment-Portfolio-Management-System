import { useState, type ChangeEvent } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Trash2,
  Key,
  Pencil,
  Save,
  MailCheck,
  MailWarning,
  User,
  MapPin,
  BarChart2,
  Shield,
  LogOut,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { CountrySelect } from '@/components';

const roles = ['Admin', 'Editor', 'Viewer'];
type EmailStatus = 'Verified' | 'Pending' | 'Rejected';

const emailStatusIcon = {
  Verified: <MailCheck className='w-4 h-4 text-green-700' />,
  Pending: <MailWarning className='w-4 h-4 text-yellow-500' />,
  Rejected: <MailWarning className='w-4 h-4 text-red-700' />,
};

const UserProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://randomuser.me/api/portraits/men/32.jpg'
  );
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  // Editable states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);

  // Form values
  const [firstName, setFirstName] = useState('Cameron');
  const [lastName, setLastName] = useState('Williamson');
  const [email, setEmail] = useState('cameron.williamson@example.com');
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('Rejected');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [bio, setBio] = useState(
    'Product designer, photographer, and travel enthusiast. Working on new projects and ideas.'
  );

  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('Punjab');
  const [line1, setLine1] = useState('123 Market St');
  const [line2, setLine2] = useState('Suite 500');
  const [zipCode, setZipCode] = useState('94103');

  const [metrics, setMetrics] = useState({
    joined: 'Jan 1, 2023',
    itineraries: 12,
    destinations: 34,
    plans: 5,
    revenue: '$2,450',
  });

  return (
    <div className=' flex flex-col gap-8  lg:flex-row w-full min-h-screen'>
      <aside className='w-full lg:w-72 lg:min-w-[18rem] bg-white p-6 flex flex-col gap-6 shadow-100 rounded-lg h-fit'>
        <div className='flex flex-col items-center gap-4'>
          <Avatar className='w-28 h-28 !shadow-300 ring-4 ring-primary'>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className='bg-muted p-24-bold'>
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className='text-center'>
            <h3 className='p-20-semibold '>
              {firstName} {lastName}
            </h3>
            <p className='p-14-regular text-gray-100'>Admin</p>
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='avatar-upload'>
              <Button variant='outline' size='sm' className='gap-2'>
                <Pencil className='w-4 h-4' />
                Change Photo
              </Button>
            </Label>
            <Input
              type='file'
              id='avatar-upload'
              className='hidden'
              accept='image/*'
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <Separator className='bg-border' />
        <div className='space-y-6 px-3'>
          <div>
            <h4 className='p-16-semibold'>Roles</h4>
            <div className='flex flex-wrap gap-2 mt-2'>
              {roles.map((role) => (
                <Badge key={role}>{role}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className='p-16-semibold'>Last Login</h4>
            <p className='p-14-regular text-gray-100 mt-2'>4 minutes ago</p>
          </div>
        </div>
        <Separator className='bg-border' />

        <div className='space-y-2'>
          <Button
            variant='ghost'
            className='w-full justify-start'
            onClick={() => {
              /* change pwd */
            }}
          >
            <LogOut className='mr-2 w-4 h-4' /> Logout
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start'
            onClick={() => {
              /* change pwd */
            }}
          >
            <Key className='mr-2 w-4 h-4' /> Change Password
          </Button>
          <Button variant='destructive' className='w-full justify-start'>
            <Trash2 className='mr-2 w-4 h-4' /> Delete User
          </Button>
        </div>
        <Separator className='bg-[var(--border)]' />
        <div>
          <h4 className='p-14-medium flex items-center gap-2 mb-4'>
            <Shield className='w-4 h-4' /> <span>Account Status</span>
          </h4>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='p-14-regular'>Profile Completion</span>
              <span className='p-14-medium text-primary'>85%</span>
            </div>
            <Progress value={85} className='h-2 bg-muted' />
          </div>
        </div>
      </aside>

      <main className='flex-1 space-y-8 '>
        <Card className='!shadow-100 rounded-lg border-none bg-white'>
          <CardHeader className='flex justify-between items-center pb-4'>
            <div className='flex items-center gap-3'>
              <User className='w-5 h-5 text-primary mb-1' />
              <h3 className='p-20-semibold'>Personal Information</h3>
            </div>
            <Button
              variant={isEditingPersonal ? 'default' : 'outline'}
              size='sm'
              onClick={() => setIsEditingPersonal((prevState) => !prevState)}
              className='gap-2'
            >
              {isEditingPersonal ? (
                <Save className='w-4 h-4' />
              ) : (
                <Pencil className='w-4 h-4' />
              )}
              {isEditingPersonal ? 'Save Changes' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-2'>
            <div className='flex flex-col gap-2'>
              <Label
                className='p-14-regular text-gray-100'
                htmlFor='first-name'
              >
                First Name
              </Label>
              <Input
                id='first-name'
                className='py-5 px-4 border rounded-lg'
                placeholder='Enter number of days (e.g., 5, 12)'
                style={{
                  background: 'var(--card)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#7f7e83',
                }}
                value={firstName}
                readOnly={!isEditingPersonal}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label className='p-14-regular text-gray-100' htmlFor='last-name'>
                Last Name
              </Label>
              <Input
                id='last-name'
                className='py-5 px-4 border rounded-lg'
                placeholder='Enter number of days (e.g., 5, 12)'
                style={{
                  background: 'var(--card)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#7f7e83',
                }}
                value={lastName}
                readOnly={!isEditingPersonal}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className='col-span-full flex flex-col gap-1'>
              <Label
                className='p-14-regular text-gray-100'
                htmlFor='email-address'
              >
                Email Address
              </Label>
              <div className='flex items-center gap-2'>
                <Input
                  id='email-address'
                  className='py-5 px-4 border rounded-lg'
                  placeholder='Enter number of days (e.g., 5, 12)'
                  style={{
                    background: 'var(--card)',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#7f7e83',
                  }}
                  value={email}
                  readOnly={!isEditingPersonal}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Badge
                  className={`flex items-center gap-1'
                     ${
                       emailStatus === 'Verified'
                         ? 'bg-green-300'
                         : emailStatus === 'Pending'
                         ? 'bg-yellow-300'
                         : 'bg-red-300'
                     }
                  `}
                >
                  {emailStatusIcon[emailStatus]}
                  {emailStatus}
                </Badge>
              </div>
            </div>
            <div className='col-span-full flex flex-col gap-1'>
              <Label className='p-14-regular text-gray-100' htmlFor='bio'>
                Bio
              </Label>
              <textarea
                id='bio'
                value={bio}
                readOnly={!isEditingPersonal}
                onChange={(e) => setBio(e.target.value)}
                className='flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-4 py-4 p-16-regular ring-offset-background placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-100'
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className='!shadow-100 rounded-lg border-none bg-white'>
          <CardHeader className='flex justify-between items-center pb-4'>
            <div className='flex items-center gap-3'>
              <MapPin className='w-5 h-5 text-primary' />
              <h3 className='p-20-semibold'>Address Information</h3>
            </div>
            <Button
              variant={isEditingAddress ? 'default' : 'outline'}
              size='sm'
              onClick={() => setIsEditingAddress((prevState) => !prevState)}
              className='gap-2'
            >
              {isEditingAddress ? (
                <Save className='w-4 h-4' />
              ) : (
                <Pencil className='w-4 h-4' />
              )}
              {isEditingAddress ? 'Save Changes' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-2'>
            {isEditingAddress ? (
              <CountrySelect />
            ) : (
              <>
                <div className='flex flex-col gap-2'>
                  <Label className='p-14-regular text-gray-100' id='country'>
                    Country
                  </Label>
                  <Input
                    id='country'
                    className='py-5 px-4 border rounded-lg'
                    placeholder='Enter number of days (e.g., 5, 12)'
                    style={{
                      background: 'var(--card)',
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#7f7e83',
                    }}
                    value={country}
                    readOnly={true}
                  />
                </div>
              </>
            )}

            <div className='flex flex-col gap-2'>
              <Label className='p-14-regular text-gray-100' htmlFor='state'>
                State
              </Label>
              <Input
                id='state'
                className='py-5 px-4 border rounded-lg'
                placeholder='Enter number of days (e.g., 5, 12)'
                style={{
                  background: 'var(--card)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#7f7e83',
                }}
                value={state}
                readOnly={!isEditingAddress}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label className='p-14-regular text-gray-100' htmlFor='city'>
                City
              </Label>
              <Input
                id='city'
                className='py-5 px-4 border rounded-lg'
                placeholder='Enter number of days (e.g., 5, 12)'
                style={{
                  background: 'var(--card)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#7f7e83',
                }}
                value={city}
                readOnly={!isEditingAddress}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label className='p-14-regular text-gray-100' htmlFor='zip'>
                ZIP Code
              </Label>
              <Input
                id='zip'
                className='py-5 px-4 border rounded-lg'
                placeholder='Enter number of days (e.g., 5, 12)'
                style={{
                  background: 'var(--card)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#7f7e83',
                }}
                value={zipCode}
                readOnly={!isEditingAddress}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2 col-span-2'>
              <Label
                className='p-14-regular text-gray-100'
                htmlFor='address-line1'
              >
                Address Line 1
              </Label>
              <Input
                id='address-line1'
                className='py-5 px-4 border rounded-lg'
                placeholder='Enter number of days (e.g., 5, 12)'
                style={{
                  background: 'var(--card)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#7f7e83',
                }}
                value={line1}
                readOnly={!isEditingAddress}
                onChange={(e) => setLine1(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2 col-span-2'>
              <Label
                className='p-14-regular text-gray-100'
                htmlFor='address-line2'
              >
                Address Line 2
              </Label>
              <Input
                id='address-line2'
                className='py-5 px-4 border rounded-lg'
                placeholder='Enter number of days (e.g., 5, 12)'
                style={{
                  background: 'var(--card)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#7f7e83',
                }}
                value={line2}
                readOnly={!isEditingAddress}
                onChange={(e) => setLine2(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='!shadow-100 rounded-lg border-none bg-white'>
          <CardHeader className='flex justify-between items-center pb-4'>
            <div className='flex items-center gap-3'>
              <BarChart2 className='w-6 h-6 text-primary mb-1' />
              <h3 className='p-20-semibold'>Usage & Metrics</h3>
            </div>
          </CardHeader>
          <CardContent className='grid grid-cols-2 gap-6 pt-2'>
            {Object.entries(metrics).map(([key, value]) => (
              <div className='flex flex-col gap-2' key={key + value}>
                <Label className='p-14-regular text-gray-100' id='country'>
                  {key.replace(/([A-Z])/g, ' $1')}
                </Label>
                <Input
                  id='country'
                  className='py-5 px-4 border rounded-lg'
                  placeholder='Enter number of days (e.g., 5, 12)'
                  style={{
                    background: 'var(--card)',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#7f7e83',
                  }}
                  value={value}
                  readOnly={true}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserProfilePage;
