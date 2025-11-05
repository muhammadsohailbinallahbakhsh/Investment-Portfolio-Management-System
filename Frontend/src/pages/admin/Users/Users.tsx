import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/Pagination';
import {
  Search,
  Loader2,
  Eye,
  UserCheck,
  UserX,
  Power,
  Trash2,
} from 'lucide-react';
import api from '@/api/api';
import { formatDateTime } from '@/utils';

interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  emailConfirmed: boolean;
  portfolioCount: number;
  investmentCount: number;
  transactionCount: number;
  totalInvestmentValue: number;
  totalGainLoss: number;
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt: string | null;
  accountStatus: string;
  daysSinceRegistration: number;
}

interface PagedResponse {
  data: UserManagement[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const ManageUsersTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useQuery<PagedResponse>({
    queryKey: ['admin-users', currentPage, pageSize, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (debouncedSearch) {
        params.append('searchTerm', debouncedSearch);
      }

      const response = await api.get<PagedResponse>(
        `/api/admin/users?${params.toString()}`
      );
      return response.data;
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.patch(`/api/admin/users/${userId}/activate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert('User account activated successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to activate user');
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.patch(`/api/admin/users/${userId}/deactivate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert('User account deactivated successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to deactivate user');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/api/admin/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert('User account deleted successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete user');
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleActivateUser = (userId: string, userName: string) => {
    if (
      window.confirm(`Are you sure you want to activate ${userName}'s account?`)
    ) {
      activateMutation.mutate(userId);
    }
  };

  const handleDeactivateUser = (userId: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to deactivate ${userName}'s account?`
      )
    ) {
      deactivateMutation.mutate(userId);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${userName}'s account? This is a soft delete and can be reversed.`
      )
    ) {
      deleteMutation.mutate(userId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'Admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <main className='w-full flex flex-col gap-6'>
      <PageHeader
        heading='Manage Users'
        subHeading='Search, filter, and manage all system users'
      />

      {/* Search Bar */}
      <Card className='p-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            type='text'
            placeholder='Search users by name or email...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
      </Card>

      {/* Users Table */}
      <div className='bg-white rounded-2xl'>
        <Card className='w-full bg-white border-0 shadow-sm gap-0 pt-0'>
          {/* Stats Header */}
          {data && !isLoading && (
            <div className='bg-gray-50 p-4 rounded-t-xl border-b'>
              <p className='text-sm text-gray-600'>
                Showing{' '}
                <span className='font-semibold'>{data.data.length}</span> of{' '}
                <span className='font-semibold'>{data.totalCount}</span> users
                {debouncedSearch && (
                  <span className='ml-2'>
                    (filtered by:{' '}
                    <span className='font-semibold'>"{debouncedSearch}"</span>)
                  </span>
                )}
              </p>
            </div>
          )}
          {/* Loading State */}
          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className='flex items-center justify-center py-12'>
              <p className='text-red-500'>
                Error loading users:{' '}
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && data && (
            <Table>
              <TableHeader>
                <TableRow className='border-none bg-gray-50'>
                  <TableHead className='font-semibold text-gray-700'>
                    User
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Email
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Role
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Status
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Portfolios
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Total Value
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Joined
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700 text-right'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='text-center py-8 text-gray-500'
                    >
                      {debouncedSearch
                        ? `No users found matching "${debouncedSearch}"`
                        : 'No users found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((user: UserManagement) => (
                    <TableRow
                      key={user.id}
                      className='hover:bg-gray-50 border-b border-gray-100'
                    >
                      {/* User Name with Avatar */}
                      <TableCell className='font-medium'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                            <span className='text-sm font-semibold text-blue-700'>
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </span>
                          </div>
                          <div className='flex flex-col'>
                            <span className='text-sm font-medium text-gray-900'>
                              {user.fullName}
                            </span>
                            {user.lastLoginAt && (
                              <span className='text-xs text-gray-500'>
                                Last login: {formatDateTime(user.lastLoginAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='text-sm text-gray-900'>
                            {user.email}
                          </span>
                          {user.emailConfirmed ? (
                            <span className='text-xs text-green-600 flex items-center gap-1'>
                              <UserCheck className='h-3 w-3' /> Verified
                            </span>
                          ) : (
                            <span className='text-xs text-orange-600 flex items-center gap-1'>
                              <UserX className='h-3 w-3' /> Unverified
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Badge className={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={getStatusBadgeVariant(user.accountStatus)}
                        >
                          {user.accountStatus}
                        </Badge>
                      </TableCell>

                      {/* Portfolios */}
                      <TableCell>
                        <div className='text-sm'>
                          <div className='text-gray-900'>
                            {user.portfolioCount} portfolios
                          </div>
                          <div className='text-xs text-gray-500'>
                            {user.investmentCount} investments
                          </div>
                        </div>
                      </TableCell>

                      {/* Total Value */}
                      <TableCell>
                        <div className='text-sm'>
                          <div className='font-medium text-gray-900'>
                            $
                            {user.totalInvestmentValue.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                          {user.totalGainLoss !== 0 && (
                            <div
                              className={`text-xs ${
                                user.totalGainLoss >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {user.totalGainLoss >= 0 ? '+' : ''}$
                              {user.totalGainLoss.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell>
                        <div className='text-sm'>
                          <div className='text-gray-900'>
                            {formatDateTime(user.createdAt)}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {user.daysSinceRegistration} days ago
                          </div>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleViewUser(user.id)}
                            title='View details'
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                          {user.isActive && !user.isDeleted ? (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                handleDeactivateUser(user.id, user.fullName)
                              }
                              title='Deactivate user'
                              className='text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                            >
                              <Power className='h-4 w-4' />
                            </Button>
                          ) : !user.isDeleted ? (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                handleActivateUser(user.id, user.fullName)
                              }
                              title='Activate user'
                              className='text-green-600 hover:text-green-700 hover:bg-green-50'
                            >
                              <Power className='h-4 w-4' />
                            </Button>
                          ) : null}
                          {!user.isDeleted && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                handleDeleteUser(user.id, user.fullName)
                              }
                              title='Delete user'
                              className='text-red-600 hover:text-red-700 hover:bg-red-50'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Pagination */}
        {!isLoading && !isError && data && data.totalPages > 1 && (
          <div className='flex justify-center py-4'>
            <Pagination
              totalRecords={data.totalCount}
              pageSize={data.pageSize}
              currentPage={data.page}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ManageUsersTable;
