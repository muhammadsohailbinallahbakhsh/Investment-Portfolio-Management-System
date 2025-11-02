import icons from '@/constants/icons';
import images from '@/constants/images';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface UserProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  joinedDate: string;
  isSidebar?: boolean;
}

const UserProfileCard = ({
  name,
  email,
  avatarUrl,
  joinedDate,
  isSidebar,
}: UserProfileCardProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {isSidebar ? (
          <div className='flex items-center gap-2.5 mt-4 cursor-pointer'>
            <img
              src={images.michaelImg}
              alt='Profile'
              className='h-10 w-10 rounded-full'
            />
            <div className='flex flex-col'>
              <h3 className='p-16-semibold text-dark-100 truncate'>
                Muhammad Sohail
              </h3>
              <p className='p-16-regular text-gray-100 truncate max-w-[150px] overflow-hidden whitespace-nowrap'>
                sohail@gmail.com
              </p>
            </div>
          </div>
        ) : (
          <img
            src={images.michaelImg}
            alt='Profile'
            className='h-[35px] w-[35px] rounded-full cursor-pointer'
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-64 p-0 border-none bg-white shadow-2xl'
      >
        <Card className='border-none p-4'>
          <CardHeader className='flex flex-col justify-between items-center bg-muted p-4 rounded-t-lg'>
            <span className='p-16-medium'>Your profile</span>
            <span className='flex items-center justify-between p-14-regular text-gray-100 w-full'>
              <span className='flex gap-2 items-center'>
                <Calendar className='w-4 h-4' />
                Joined
              </span>
              <span> {joinedDate}</span>
            </span>
          </CardHeader>
          <CardContent className='px-0 space-y-2'>
            <div className='flex items-center gap-3'>
              <Avatar className='w-10 h-10'>
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} />
                ) : (
                  <AvatarFallback>{name[0]}</AvatarFallback>
                )}
              </Avatar>
              <div className='flex-1'>
                <p className='p-14-semibold'>{name}</p>
                <p className='p-14-regular text-gray-100'>{email}</p>
              </div>
            </div>
            <Button variant='outline' className='w-full mt-2'>
              Details
            </Button>
            <Button variant='outline' className='w-full mt-2'>
              Log out
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfileCard;
