import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <FileQuestion className='h-16 w-16 text-gray-400' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center space-y-4'>
          <p className='text-gray-600'>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className='text-sm text-gray-500'>
            Please check the URL or navigate back to continue.
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

export default NotFound;
