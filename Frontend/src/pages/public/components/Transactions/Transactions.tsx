import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions, useInvestmentSummaries } from '@/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components';
import { TRANSACTION_TYPES } from '@/constants/appConstants';
import {
  Loader2,
  Plus,
  Search,
  Filter,
  X,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
} from 'lucide-react';
import type { Transaction, TransactionFilterParams } from '@/types';

const Transactions = () => {
  const navigate = useNavigate();

  // Filters and pagination state
  const [filters, setFilters] = useState<TransactionFilterParams>({
    pageNumber: 1,
    pageSize: 12,
    investmentId: undefined,
    type: undefined,
    startDate: undefined,
    endDate: undefined,
    searchTerm: '',
    sortBy: 'transactionDate',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Queries
  const { data: transactionsData, isLoading } = useTransactions(filters);
  const { data: investmentsData } = useInvestmentSummaries();

  // Extract data
  const transactions = transactionsData?.data || [];
  const totalCount = transactionsData?.totalCount || 0;
  const totalPages = transactionsData?.totalPages || 1;
  const investments = investmentsData?.data || [];
  const transactionTypes = TRANSACTION_TYPES;

  // Stats calculation
  const stats = useMemo(() => {
    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    const buyAmount = transactions
      .filter((txn) => txn.type === 'Buy')
      .reduce((sum, txn) => sum + txn.amount, 0);
    const sellAmount = transactions
      .filter((txn) => txn.type === 'Sell')
      .reduce((sum, txn) => sum + txn.amount, 0);

    return {
      totalTransactions: totalCount,
      totalAmount,
      buyAmount,
      sellAmount,
      netAmount: buyAmount - sellAmount,
    };
  }, [transactions, totalCount]);

  // Handle filter changes
  const handleFilterChange = (
    key: keyof TransactionFilterParams,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNumber: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFilterChange('searchTerm', value);
  };

  const clearFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 12,
      investmentId: undefined,
      type: undefined,
      startDate: undefined,
      endDate: undefined,
      searchTerm: '',
      sortBy: 'transactionDate',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.investmentId ||
    filters.type ||
    filters.startDate ||
    filters.endDate ||
    filters.searchTerm;

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get transaction icon and color
  const getTransactionStyle = (type: string) => {
    switch (type) {
      case 'Buy':
        return {
          icon: ArrowDownRight,
          color: 'text-success-700',
          bgColor: 'bg-success-100',
        };
      case 'Sell':
        return {
          icon: ArrowUpRight,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
        };
      case 'Update':
        return {
          icon: RefreshCw,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
        };
      default:
        return {
          icon: Package,
          color: 'text-dark-500',
          bgColor: 'bg-light-300',
        };
    }
  };

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='p-32-bold text-dark-900'>Transactions</h1>
          <p className='p-16-regular text-dark-600 mt-1'>
            Track all your investment transactions
          </p>
        </div>
        <Button
          onClick={() => navigate('/transactions/add')}
          className='bg-primary-500 hover:bg-primary-600'
        >
          <Plus className='mr-2 h-4 w-4' />
          Add Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-light-400'>
          <CardHeader className='pb-2'>
            <CardDescription className='p-14-regular text-dark-600'>
              Total Transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Package className='h-5 w-5 text-primary-500' />
              <p className='p-24-bold text-dark-900'>
                {stats.totalTransactions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400'>
          <CardHeader className='pb-2'>
            <CardDescription className='p-14-regular text-dark-600'>
              Total Amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <DollarSign className='h-5 w-5 text-primary-500' />
              <p className='p-24-bold text-dark-900'>
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400'>
          <CardHeader className='pb-2'>
            <CardDescription className='p-14-regular text-dark-600'>
              Buy Amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <ArrowDownRight className='h-5 w-5 text-success-700' />
              <p className='p-24-bold text-success-700'>
                {formatCurrency(stats.buyAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400'>
          <CardHeader className='pb-2'>
            <CardDescription className='p-14-regular text-dark-600'>
              Sell Amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <ArrowUpRight className='h-5 w-5 text-red-500' />
              <p className='p-24-bold text-red-500'>
                {formatCurrency(stats.sellAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className='border-light-400'>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            {/* Search and Filter Toggle */}
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400' />
                <Input
                  placeholder='Search by investment name...'
                  value={filters.searchTerm || ''}
                  onChange={handleSearchChange}
                  className='pl-10 border-light-400'
                />
              </div>
              <div className='flex items-center gap-2'>
                {hasActiveFilters && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={clearFilters}
                    className='border-light-400'
                  >
                    <X className='mr-2 h-4 w-4' />
                    Clear Filters
                  </Button>
                )}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowFilters(!showFilters)}
                  className='border-light-400'
                >
                  <Filter className='mr-2 h-4 w-4' />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className='grid grid-cols-1 gap-4 p-4 bg-light-200 rounded-lg md:grid-cols-2 lg:grid-cols-4'>
                {/* Investment Filter */}
                <div className='space-y-2'>
                  <Label className='p-14-semibold text-dark-700'>
                    Investment
                  </Label>
                  <Select
                    key={`investmentId-${filters.investmentId || 'all'}`}
                    value={filters.investmentId?.toString() || 'all'}
                    onValueChange={(value) =>
                      handleFilterChange(
                        'investmentId',
                        value === 'all' ? undefined : parseInt(value)
                      )
                    }
                  >
                    <SelectTrigger className='border-light-400 bg-white'>
                      <SelectValue placeholder='All Investments' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Investments</SelectItem>
                      {investments.map((investment) => (
                        <SelectItem
                          key={investment.id}
                          value={investment.id.toString()}
                        >
                          {investment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div className='space-y-2'>
                  <Label className='p-14-semibold text-dark-700'>Type</Label>
                  <Select
                    key={`type-${filters.type || 'all'}`}
                    value={filters.type || 'all'}
                    onValueChange={(value) =>
                      handleFilterChange(
                        'type',
                        value === 'all' ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger className='border-light-400 bg-white'>
                      <SelectValue placeholder='All Types' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Types</SelectItem>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Date Filter */}
                <div className='space-y-2'>
                  <Label className='p-14-semibold text-dark-700'>
                    Start Date
                  </Label>
                  <Input
                    type='date'
                    value={filters.startDate || ''}
                    onChange={(e) =>
                      handleFilterChange('startDate', e.target.value)
                    }
                    className='border-light-400 bg-white'
                  />
                </div>

                {/* End Date Filter */}
                <div className='space-y-2'>
                  <Label className='p-14-semibold text-dark-700'>
                    End Date
                  </Label>
                  <Input
                    type='date'
                    value={filters.endDate || ''}
                    onChange={(e) =>
                      handleFilterChange('endDate', e.target.value)
                    }
                    className='border-light-400 bg-white'
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      {isLoading ? (
        <Card className='border-light-400'>
          <CardContent className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary-500' />
          </CardContent>
        </Card>
      ) : transactions.length === 0 ? (
        <Card className='border-light-400'>
          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
            <Package className='h-16 w-16 text-dark-300 mb-4' />
            <h3 className='p-20-bold text-dark-900 mb-2'>
              No Transactions Found
            </h3>
            <p className='p-16-regular text-dark-600 mb-4'>
              {hasActiveFilters
                ? 'Try adjusting your filters to find more transactions.'
                : 'Start tracking your investment activities by adding your first transaction.'}
            </p>
            {!hasActiveFilters && (
              <Button
                onClick={() => navigate('/transactions/add')}
                className='bg-primary-500 hover:bg-primary-600'
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Transaction
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card className='border-light-400 hidden lg:block'>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='border-b border-light-400 bg-light-200'>
                    <tr>
                      <th className='px-6 py-3 text-left p-14-semibold text-dark-700'>
                        Date
                      </th>
                      <th className='px-6 py-3 text-left p-14-semibold text-dark-700'>
                        Investment
                      </th>
                      <th className='px-6 py-3 text-left p-14-semibold text-dark-700'>
                        Type
                      </th>
                      <th className='px-6 py-3 text-right p-14-semibold text-dark-700'>
                        Quantity
                      </th>
                      <th className='px-6 py-3 text-right p-14-semibold text-dark-700'>
                        Price/Unit
                      </th>
                      <th className='px-6 py-3 text-right p-14-semibold text-dark-700'>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-light-400'>
                    {transactions.map((transaction) => {
                      const style = getTransactionStyle(transaction.type);
                      const Icon = style.icon;

                      return (
                        <tr
                          key={transaction.id}
                          className='hover:bg-light-100 transition-colors'
                        >
                          <td className='px-6 py-4 p-14-regular text-dark-700'>
                            <div className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4 text-dark-400' />
                              {formatDate(transaction.transactionDate)}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div>
                              <p className='p-14-semibold text-dark-900'>
                                {transaction.investmentName}
                              </p>
                              <p className='p-12-regular text-dark-500'>
                                {transaction.investmentType}
                              </p>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${style.bgColor}`}
                            >
                              <Icon className={`h-4 w-4 ${style.color}`} />
                              <span className={`p-12-semibold ${style.color}`}>
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4 text-right p-14-regular text-dark-700'>
                            {transaction.quantity.toLocaleString()}
                          </td>
                          <td className='px-6 py-4 text-right p-14-regular text-dark-700'>
                            {formatCurrency(transaction.pricePerUnit)}
                          </td>
                          <td className='px-6 py-4 text-right p-16-semibold text-dark-900'>
                            {formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Card View */}
          <div className='grid grid-cols-1 gap-4 lg:hidden'>
            {transactions.map((transaction) => {
              const style = getTransactionStyle(transaction.type);
              const Icon = style.icon;

              return (
                <Card
                  key={transaction.id}
                  className='border-light-400 shadow-100'
                >
                  <CardContent className='pt-6 space-y-4'>
                    {/* Header */}
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h3 className='p-16-semibold text-dark-900'>
                          {transaction.investmentName}
                        </h3>
                        <p className='p-12-regular text-dark-500'>
                          {transaction.investmentType}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${style.bgColor}`}
                      >
                        <Icon className={`h-4 w-4 ${style.color}`} />
                        <span className={`p-12-semibold ${style.color}`}>
                          {transaction.type}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='p-14-regular text-dark-600'>
                          Quantity:
                        </span>
                        <span className='p-14-semibold text-dark-900'>
                          {transaction.quantity.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='p-14-regular text-dark-600'>
                          Price/Unit:
                        </span>
                        <span className='p-14-semibold text-dark-900'>
                          {formatCurrency(transaction.pricePerUnit)}
                        </span>
                      </div>
                      <div className='flex items-center justify-between pt-2 border-t border-light-400'>
                        <span className='p-14-semibold text-dark-700'>
                          Total Amount:
                        </span>
                        <span className='p-16-bold text-dark-900'>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className='flex items-center gap-2 text-dark-600 pt-2 border-t border-light-400'>
                      <Calendar className='h-4 w-4' />
                      <span className='p-12-regular'>
                        {formatDate(transaction.transactionDate)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center mt-6'>
              <Pagination
                currentPage={filters.pageNumber || 1}
                totalRecords={totalCount}
                pageSize={filters.pageSize || 12}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;
