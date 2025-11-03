import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <ShieldAlert className='h-16 w-16 text-red-500' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center space-y-4'>
          <p className='text-gray-600'>
            You don't have permission to access this page.
          </p>
          <p className='text-sm text-gray-500'>
            If you believe this is an error, please contact your administrator.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center pt-4'>
            <Button variant='outline' onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Forbidden;
