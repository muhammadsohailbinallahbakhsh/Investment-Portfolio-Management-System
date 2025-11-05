import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Activity,
  UserCheck,
  UserX,
  Power,
  Trash2,
  Edit,
  Shield,
  User,
} from 'lucide-react';
import api from '@/api/api';
import { formatDateTime } from '@/utils';

interface PortfolioSummary {
  id: number;
  name: string;
  investmentCount: number;
  totalValue: number;
  createdAt: string;
}

interface RecentActivity {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
}

interface UserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt: string | null;
  portfolios: PortfolioSummary[];
  totalInvestments: number;
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  totalTransactions: number;
  lastTransactionDate: string | null;
  recentActivities: RecentActivity[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: UserDetail;
}

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user detail
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['admin-user-detail', userId],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(`/api/admin/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  // Activate user mutation
  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/api/admin/users/${id}/activate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-user-detail', userId],
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert('User account activated successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to activate user');
    },
  });

  // Deactivate user mutation
  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/api/admin/users/${id}/deactivate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-user-detail', userId],
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert('User account deactivated successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to deactivate user');
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert('User account deleted successfully');
      navigate('/admin/users');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete user');
    },
  });

  const handleActivate = () => {
    if (
      userId &&
      window.confirm(
        `Are you sure you want to activate this user account? They will be able to log in and access the system.`
      )
    ) {
      activateMutation.mutate(userId);
    }
  };

  const handleDeactivate = () => {
    if (
      userId &&
      window.confirm(
        `Are you sure you want to deactivate this user account? They will not be able to log in until reactivated.`
      )
    ) {
      deactivateMutation.mutate(userId);
    }
  };

  const handleDelete = () => {
    if (
      userId &&
      window.confirm(
        `Are you sure you want to delete this user account? This is a soft delete and can be reversed, but the user will not be able to log in.`
      )
    ) {
      deleteMutation.mutate(userId);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/users/${userId}/edit`);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
        <p className='text-red-500'>
          Error loading user details:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <Button onClick={() => navigate('/admin/users')}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Users
        </Button>
      </div>
    );
  }

  if (!data?.data) {
    return null;
  }

  const user = data.data;

  return (
    <main className='w-full flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => navigate('/admin/users')}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <PageHeader
            heading='User Details'
            subHeading={`Manage ${user.fullName}'s account`}
            buttonCaption=''
          />
        </div>
      </div>

      {/* User Info Card */}
      <Card className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-4'>
            {/* Avatar */}
            <div className='w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center'>
              <span className='text-2xl font-semibold text-blue-700'>
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            </div>

            {/* User Info */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  {user.fullName}
                </h2>
                <Badge
                  className={
                    user.role === 'Admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }
                >
                  {user.role === 'Admin' ? (
                    <Shield className='h-3 w-3 mr-1' />
                  ) : (
                    <User className='h-3 w-3 mr-1' />
                  )}
                  {user.role}
                </Badge>
              </div>

              <div className='flex items-center gap-4 text-sm text-gray-600'>
                <div className='flex items-center gap-1'>
                  <Mail className='h-4 w-4' />
                  {user.email}
                </div>
                {user.emailConfirmed ? (
                  <Badge className='bg-green-100 text-green-800'>
                    <UserCheck className='h-3 w-3 mr-1' />
                    Verified
                  </Badge>
                ) : (
                  <Badge className='bg-orange-100 text-orange-800'>
                    <UserX className='h-3 w-3 mr-1' />
                    Unverified
                  </Badge>
                )}
              </div>

              <div className='flex items-center gap-4 text-sm text-gray-600'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  Joined: {formatDateTime(user.createdAt)}
                </div>
                {user.lastLoginAt && (
                  <div className='flex items-center gap-1'>
                    <Activity className='h-4 w-4' />
                    Last login: {formatDateTime(user.lastLoginAt)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={handleEdit}>
              <Edit className='h-4 w-4 mr-2' />
              Edit
            </Button>

            {user.isActive ? (
              <Button
                variant='outline'
                size='sm'
                onClick={handleDeactivate}
                disabled={deactivateMutation.isPending}
              >
                {deactivateMutation.isPending ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Power className='h-4 w-4 mr-2' />
                )}
                Deactivate
              </Button>
            ) : (
              <Button
                variant='outline'
                size='sm'
                onClick={handleActivate}
                disabled={activateMutation.isPending}
              >
                {activateMutation.isPending ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Power className='h-4 w-4 mr-2' />
                )}
                Activate
              </Button>
            )}

            <Button
              variant='outline'
              size='sm'
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className='text-red-600 hover:text-red-700'
            >
              {deleteMutation.isPending ? (
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              ) : (
                <Trash2 className='h-4 w-4 mr-2' />
              )}
              Delete
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className='mt-4 pt-4 border-t'>
          <Badge
            className={
              user.isDeleted
                ? 'bg-red-100 text-red-800'
                : user.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }
          >
            {user.isDeleted ? 'Deleted' : user.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Total Invested</p>
              <p className='text-2xl font-bold text-gray-900'>
                $
                {user.totalInvested.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <DollarSign className='h-8 w-8 text-blue-500' />
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Current Value</p>
              <p className='text-2xl font-bold text-gray-900'>
                $
                {user.currentValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <Briefcase className='h-8 w-8 text-green-500' />
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Gain/Loss</p>
              <p
                className={`text-2xl font-bold ${
                  user.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {user.totalGainLoss >= 0 ? '+' : ''}$
                {user.totalGainLoss.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p
                className={`text-sm ${
                  user.gainLossPercentage >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {user.gainLossPercentage >= 0 ? '+' : ''}
                {user.gainLossPercentage.toFixed(2)}%
              </p>
            </div>
            {user.totalGainLoss >= 0 ? (
              <TrendingUp className='h-8 w-8 text-green-500' />
            ) : (
              <TrendingDown className='h-8 w-8 text-red-500' />
            )}
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Portfolios</p>
              <p className='text-2xl font-bold text-gray-900'>
                {user.portfolios.length}
              </p>
              <p className='text-sm text-gray-600'>
                {user.totalInvestments} investments
              </p>
            </div>
            <Briefcase className='h-8 w-8 text-purple-500' />
          </div>
        </Card>
      </div>

      {/* Portfolios Table */}
      {user.portfolios.length > 0 && (
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Portfolios ({user.portfolios.length})
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Portfolio Name</TableHead>
                <TableHead>Investments</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.portfolios.map((portfolio: PortfolioSummary) => (
                <TableRow key={portfolio.id}>
                  <TableCell className='font-medium'>
                    {portfolio.name}
                  </TableCell>
                  <TableCell>{portfolio.investmentCount}</TableCell>
                  <TableCell>
                    $
                    {portfolio.totalValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className='text-sm text-gray-600'>
                    {formatDateTime(portfolio.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Recent Activity */}
      {user.recentActivities.length > 0 && (
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Recent Activity
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.recentActivities.map((activity: RecentActivity) => (
                <TableRow key={activity.id}>
                  <TableCell className='text-sm'>
                    {formatDateTime(activity.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge className='bg-blue-100 text-blue-800'>
                      {activity.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.entityType}</TableCell>
                  <TableCell className='text-sm text-gray-600'>
                    {activity.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </main>
  );
};

export default UserDetail;
