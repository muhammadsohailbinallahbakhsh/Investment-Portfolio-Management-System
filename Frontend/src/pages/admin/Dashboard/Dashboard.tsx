import { PageHeader } from '@/pages/admin/components';
import StatCard from '@/pages/admin/Dashboard/StatCard';
import { dashboardStats } from '@/constants/data';
import LatestSignupsTable from '@/pages/admin/Dashboard/LatestSignupTable';

const Dashboard = () => {
  const heading: string = 'Welcome Sohail 👋';
  const subHeading: string =
    'Track activity, trends, and popular destinations in real time';
  const buttonCaption: string = 'Create a trip';

  return (
    <main className='w-full flex flex-col gap-6 items-start justify-start'>
      <PageHeader
        buttonCaption={buttonCaption}
        subHeading={subHeading}
        heading={heading}
      />
      <div className='w-full flex flex-row gap-6 items-center  flex-wrap'>
        {dashboardStats.map((statCard, index) => {
          return (
            <StatCard
              key={index}
              caption={statCard.caption}
              arrow={statCard.arrow}
              icon={statCard.icon}
              count={statCard.count}
              percentage={statCard.percentage}
            />
          );
        })}
      </div>

      <div className='flex flex-row  gap-6 items-center justify-start flex-wrap'>
        <LatestSignupsTable />
        <LatestSignupsTable />
      </div>
    </main>
  );
};

export default Dashboard;
