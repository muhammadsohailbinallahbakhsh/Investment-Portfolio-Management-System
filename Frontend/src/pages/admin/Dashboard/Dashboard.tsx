import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/pages/admin/components';
import { Card } from '@/components/ui/card';
import {
  Users,
  Briefcase,
  DollarSign,
  Activity,
  Loader2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import api from '@/api/api';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface SystemStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalPortfolios: number;
  totalInvestmentsValue: number;
  totalInvestments: number;
  activeTransactionsToday: number;
  totalTransactionsToday: number;
  transactionVolumeToday: number;
  totalTransactions: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  investmentGrowthPercentage: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: SystemStatistics;
}

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.userSlice);
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const response = await api.get<ApiResponse>('/api/admin/dashboard/stats');
      return response.data;
    },
    refetchInterval: 30000,
  });

  const stats = data?.data;

  return (
    <main className='w-full flex flex-col gap-6 items-start justify-start'>
      <PageHeader
        subHeading='Monitor system-wide statistics and user activity'
        heading={`Welcome ${firstName} 👋`}
      />

      {/* Loading State */}
      {isLoading && (
        <div className='w-full flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className='w-full flex items-center justify-center py-12'>
          <p className='text-red-500'>Failed to load system statistics</p>
        </div>
      )}

      {/* Statistics Cards */}
      {!isLoading && !isError && stats && (
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Total Users Card */}
          <Card className='p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium text-gray-600'>Total Users</p>
                <h3 className='text-3xl font-bold text-gray-900'>
                  {stats.totalUsers}
                </h3>
                <div className='flex items-center gap-2 mt-2'>
                  <div className='flex items-center gap-1 text-sm'>
                    <span className='text-green-600 font-medium'>
                      {stats.activeUsers}
                    </span>
                    <span className='text-gray-500'>active</span>
                  </div>
                  <span className='text-gray-400'>•</span>
                  <div className='flex items-center gap-1 text-sm'>
                    <span className='text-gray-600 font-medium'>
                      {stats.inactiveUsers}
                    </span>
                    <span className='text-gray-500'>inactive</span>
                  </div>
                </div>
                {stats.newUsersThisWeek > 0 && (
                  <div className='flex items-center gap-1 mt-1'>
                    <TrendingUp className='h-3 w-3 text-green-600' />
                    <span className='text-xs text-green-600'>
                      +{stats.newUsersThisWeek} this week
                    </span>
                  </div>
                )}
              </div>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </Card>

          {/* Total Portfolios Card */}
          <Card className='p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Portfolios
                </p>
                <h3 className='text-3xl font-bold text-gray-900'>
                  {stats.totalPortfolios}
                </h3>
                <div className='flex items-center gap-1 text-sm text-gray-600 mt-2'>
                  <span className='font-medium'>{stats.totalInvestments}</span>
                  <span className='text-gray-500'>total investments</span>
                </div>
              </div>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <Briefcase className='h-6 w-6 text-purple-600' />
              </div>
            </div>
          </Card>

          {/* Total Investments Value Card */}
          <Card className='p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Investment Value
                </p>
                <h3 className='text-3xl font-bold text-gray-900'>
                  $
                  {stats.totalInvestmentsValue.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </h3>
                {stats.investmentGrowthPercentage !== 0 && (
                  <div className='flex items-center gap-1 mt-2'>
                    {stats.investmentGrowthPercentage >= 0 ? (
                      <>
                        <TrendingUp className='h-3 w-3 text-green-600' />
                        <span className='text-xs text-green-600'>
                          +{stats.investmentGrowthPercentage.toFixed(2)}% growth
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className='h-3 w-3 text-red-600' />
                        <span className='text-xs text-red-600'>
                          {stats.investmentGrowthPercentage.toFixed(2)}% decline
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className='p-3 bg-green-100 rounded-lg'>
                <DollarSign className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </Card>

          {/* Active Transactions Today Card */}
          <Card className='p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium text-gray-600'>
                  Active Transactions Today
                </p>
                <h3 className='text-3xl font-bold text-gray-900'>
                  {stats.activeTransactionsToday}
                </h3>
                <div className='flex flex-col gap-1 mt-2'>
                  <div className='flex items-center gap-1 text-sm'>
                    <span className='text-gray-600 font-medium'>
                      {stats.totalTransactionsToday}
                    </span>
                    <span className='text-gray-500'>total today</span>
                  </div>
                  {stats.transactionVolumeToday > 0 && (
                    <div className='text-xs text-gray-600'>
                      Volume: $
                      {stats.transactionVolumeToday.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className='p-3 bg-orange-100 rounded-lg'>
                <Activity className='h-6 w-6 text-orange-600' />
              </div>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
