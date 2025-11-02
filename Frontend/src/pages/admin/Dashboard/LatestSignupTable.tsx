import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { latestSingupUsers } from '@/mockData';

// Sample user data - replace with your actual data structure

const LatestUserSignups = () => {
  ``;
  return (
    <Card className='w-full lg:w-[500px] border-0 bg-white p-8 shadow-100'>
      <CardHeader className='pb-6'>
        <h2 className='p-20-semibold text-dark-100'>Latest user signups</h2>
        <div className='h-px bg-border mt-4'></div>
      </CardHeader>

      <CardContent className='pt-0'>
        <Table>
          <TableHeader>
            <TableRow className='border-none hover:bg-transparent'>
              <TableHead className='p-12-regular text-gray-100 uppercase tracking-wide  h-auto px-6 pb-6'>
                NAME
              </TableHead>
              <TableHead className='p-12-regular text-gray-100 uppercase tracking-wide  h-auto px-6 p-0 pb-6 text-right'>
                ITINERARY CREATED
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {latestSingupUsers.map((user, index) => (
              <TableRow
                key={user.id}
                className={`border-none rounded-lg  ${
                  index % 2 === 0 ? 'bg-white' : 'bg-light-200'
                }`}
              >
                <TableCell className='p-0 px-6 py-[18px] rounded-l-lg'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='w-10 h-10 rounded-full'
                      />
                    </div>
                    <span className='p-14-semibold text-dark-100'>
                      {user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='px-6 py-[18px] text-right rounded-r-lg'>
                  <span className='p-14-regular text-dark-100'>
                    {user.itineraryCount}
                  </span>
                </TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LatestUserSignups;
