import { Card, CardContent } from '@/components/ui/card';
import type { StatCardPropsType } from '@/types';

const StatCard = ({
  caption,
  count,
  percentage,
  icon,
  arrow,
}: StatCardPropsType) => {
  return (
    <Card className='w-full md:w-[320px] h-44 p-6 bg-white rounded-[20px] shadow-400 border-0'>
      <CardContent className='p-0'>
        <div className='flex justify-between items-end h-full'>
          {/* Left: Textual stats */}
          <div className='flex flex-col'>
            <p className='p-16-medium text-dark-400 mb-6'>{caption}</p>
            <div>
              <h3 className='p-36-semibold text-dark-100 mb-4'>{count}</h3>
              <div className='flex flex-row items-center gap-0.5'>
                <span className='p-14-medium text-success-700 flex items-center gap-0.5'>
                  <img src={arrow} alt={caption} className='w-4 h-4' />
                  {percentage}%
                </span>
                <p className='p-14-regular text-gray-100 ml-2'>vs last month</p>
              </div>
            </div>
          </div>
          {/* Right: Icon (green chart) */}
          <div className='flex-shrink-0'>
            <img src={icon} alt='chart' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
