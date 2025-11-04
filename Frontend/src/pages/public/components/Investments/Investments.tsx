import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useInvestments,
  usePortfolioSummaries,
  useDeleteInvestment,
} from '@/api';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Pagination } from '@/components';
import {
  INVESTMENT_TYPES,
  INVESTMENT_STATUSES,
} from '@/constants/appConstants';
import {
  Loader2,
  Plus,
  Search,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Briefcase,
  BarChart3,
  Package,
  ArrowUpDown,
} from 'lucide-react';
import type { Investment, InvestmentFilterParams } from '@/types';

const Investments = () => {
  const navigate = useNavigate();

  // Filters and pagination state
  const [filters, setFilters] = useState<InvestmentFilterParams>({
    pageNumber: 1,
    pageSize: 12,
    portfolioId: undefined,
    type: undefined,
    status: undefined,
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Queries
  const { data: investmentsData, isLoading } = useInvestments(filters);
  const { data: portfoliosData } = usePortfolioSummaries();
  const deleteInvestmentMutation = useDeleteInvestment();

  // Extract data - investmentsData is PagedResponse directly
  const investments = investmentsData?.data || [];
  const totalCount = investmentsData?.totalCount || 0;
  const totalPages = investmentsData?.totalPages || 1;
  const portfolios = portfoliosData?.data || [];
  const investmentTypes = INVESTMENT_TYPES;
  const investmentStatuses = INVESTMENT_STATUSES;

  // Stats calculation
  const stats = useMemo(() => {
    return {
      totalInvestments: totalCount,
      totalValue: investments.reduce((sum, inv) => sum + inv.currentValue, 0),
      totalGainLoss: investments.reduce((sum, inv) => sum + inv.gainLoss, 0),
      activeInvestments: investments.filter((inv) => inv.status === 'Active')
        .length,
    };
  }, [investments, totalCount]);

  const avgGainLossPercentage =
    stats.totalInvestments > 0
      ? (stats.totalGainLoss / (stats.totalValue - stats.totalGainLoss)) * 100
      : 0;

  // Handle filter changes
  const handleFilterChange = (
    key: keyof InvestmentFilterParams,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNumber: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Debounce search
    handleFilterChange('searchTerm', value);
  };

  const clearFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 12,
      portfolioId: undefined,
      type: undefined,
      status: undefined,
      searchTerm: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.portfolioId || filters.type || filters.status || filters.searchTerm;

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDeleteClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvestment) {
      deleteInvestmentMutation.mutate(selectedInvestment.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedInvestment(null);
        },
      });
    }
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

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='p-32-bold text-dark-900'>Investments</h1>
          <p className='p-16-regular text-dark-600 mt-1'>
            Manage and track all your investments
          </p>
        </div>
        <Button
          onClick={() => navigate('/investments/add')}
          className='bg-primary-500 hover:bg-primary-600 text-white'
        >
          <Plus className='mr-2 h-4 w-4' />
          Add Investment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-light-400 shadow-100'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Total Investments</p>
                <p className='p-28-bold text-dark-900 mt-2'>
                  {stats.totalInvestments}
                </p>
              </div>
              <div className='rounded-full bg-primary-100 p-3'>
                <Package className='h-6 w-6 text-primary-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Total Value</p>
                <p className='p-28-bold text-dark-900 mt-2'>
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <div className='rounded-full bg-success-100 p-3'>
                <DollarSign className='h-6 w-6 text-success-700' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Total Gain/Loss</p>
                <p
                  className={`p-28-bold mt-2 ${
                    stats.totalGainLoss >= 0
                      ? 'text-success-700'
                      : 'text-red-500'
                  }`}
                >
                  {formatCurrency(stats.totalGainLoss)}
                </p>
                <p
                  className={`p-12-regular mt-1 ${
                    avgGainLossPercentage >= 0
                      ? 'text-success-700'
                      : 'text-red-500'
                  }`}
                >
                  {formatPercentage(avgGainLossPercentage)}
                </p>
              </div>
              <div
                className={`rounded-full p-3 ${
                  stats.totalGainLoss >= 0 ? 'bg-success-100' : 'bg-red-100'
                }`}
              >
                {stats.totalGainLoss >= 0 ? (
                  <TrendingUp className='h-6 w-6 text-success-700' />
                ) : (
                  <TrendingDown className='h-6 w-6 text-red-500' />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Active</p>
                <p className='p-28-bold text-dark-900 mt-2'>
                  {stats.activeInvestments}
                </p>
              </div>
              <div className='rounded-full bg-primary-100 p-3'>
                <BarChart3 className='h-6 w-6 text-primary-500' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='p-18-bold text-dark-900'>Filters</CardTitle>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowFilters(!showFilters)}
              className='border-light-400'
            >
              <Filter className='mr-2 h-4 w-4' />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {/* Search */}
              <div className='space-y-2'>
                <Label className='p-14-semibold text-dark-700'>Search</Label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400' />
                  <Input
                    placeholder='Search investments...'
                    value={filters.searchTerm || ''}
                    onChange={handleSearchChange}
                    className='pl-10 border-light-400'
                  />
                </div>
              </div>

              {/* Portfolio Filter */}
              <div className='space-y-2'>
                <Label className='p-14-semibold text-dark-700'>Portfolio</Label>
                <Select
                  value={filters.portfolioId?.toString() || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange(
                      'portfolioId',
                      value === 'all' ? undefined : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger className='border-light-400'>
                    <SelectValue placeholder='All Portfolios' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Portfolios</SelectItem>
                    {portfolios.map((portfolio) => (
                      <SelectItem
                        key={portfolio.id}
                        value={portfolio.id.toString()}
                      >
                        {portfolio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className='space-y-2'>
                <Label className='p-14-semibold text-dark-700'>Type</Label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange(
                      'type',
                      value === 'all' ? undefined : value
                    )
                  }
                >
                  <SelectTrigger className='border-light-400'>
                    <SelectValue placeholder='All Types' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Types</SelectItem>
                    {investmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className='space-y-2'>
                <Label className='p-14-semibold text-dark-700'>Status</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange(
                      'status',
                      value === 'all' ? undefined : value
                    )
                  }
                >
                  <SelectTrigger className='border-light-400'>
                    <SelectValue placeholder='All Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    {investmentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sort Options */}
            <div className='flex flex-wrap gap-4'>
              <div className='space-y-2 flex-1 min-w-[200px]'>
                <Label className='p-14-semibold text-dark-700'>Sort By</Label>
                <Select
                  value={filters.sortBy || 'createdAt'}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className='border-light-400'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='name'>Name</SelectItem>
                    <SelectItem value='type'>Type</SelectItem>
                    <SelectItem value='currentValue'>Current Value</SelectItem>
                    <SelectItem value='gainLoss'>Gain/Loss</SelectItem>
                    <SelectItem value='purchaseDate'>Purchase Date</SelectItem>
                    <SelectItem value='createdAt'>Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2 flex-1 min-w-[200px]'>
                <Label className='p-14-semibold text-dark-700'>Order</Label>
                <Select
                  value={filters.sortOrder || 'desc'}
                  onValueChange={(value: 'asc' | 'desc') =>
                    handleFilterChange('sortOrder', value)
                  }
                >
                  <SelectTrigger className='border-light-400'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='asc'>Ascending</SelectItem>
                    <SelectItem value='desc'>Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className='flex justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={clearFilters}
                  className='border-light-400'
                >
                  <X className='mr-2 h-4 w-4' />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Investments Grid */}
      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-primary-500' />
        </div>
      ) : investments.length === 0 ? (
        <Card className='border-light-400 shadow-100'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Package className='h-12 w-12 text-dark-400 mb-4' />
            <p className='p-18-bold text-dark-900 mb-2'>No investments found</p>
            <p className='p-14-regular text-dark-600 text-center mb-6'>
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results'
                : 'Get started by adding your first investment'}
            </p>
            {!hasActiveFilters && (
              <Button
                onClick={() => navigate('/investments/add')}
                className='bg-primary-500 hover:bg-primary-600 text-white'
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Investment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {investments.map((investment) => (
              <Card
                key={investment.id}
                className='border-light-400 shadow-100 hover:shadow-200 transition-shadow'
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='p-18-bold text-dark-900'>
                        {investment.name}
                      </CardTitle>
                      <CardDescription className='p-14-regular text-dark-600 mt-1'>
                        {investment.portfolioName || 'No Portfolio'}
                      </CardDescription>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        investment.status === 'Active'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-light-300 text-dark-600'
                      }`}
                    >
                      {investment.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Type Badge */}
                  <div className='flex items-center gap-2'>
                    <Briefcase className='h-4 w-4 text-dark-400' />
                    <span className='p-14-regular text-dark-700'>
                      {investment.type}
                    </span>
                  </div>

                  {/* Values */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='p-14-regular text-dark-600'>
                        Current Value:
                      </span>
                      <span className='p-16-semibold text-dark-900'>
                        {formatCurrency(investment.currentValue)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='p-14-regular text-dark-600'>
                        Initial Amount:
                      </span>
                      <span className='p-14-regular text-dark-700'>
                        {formatCurrency(investment.initialAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Gain/Loss */}
                  <div
                    className={`rounded-lg p-3 ${
                      investment.gainLoss >= 0 ? 'bg-success-100' : 'bg-red-100'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='p-14-semibold text-dark-700'>
                        Gain/Loss:
                      </span>
                      <div className='flex items-center gap-2'>
                        {investment.gainLoss >= 0 ? (
                          <TrendingUp className='h-4 w-4 text-success-700' />
                        ) : (
                          <TrendingDown className='h-4 w-4 text-red-500' />
                        )}
                        <span
                          className={`p-16-semibold ${
                            investment.gainLoss >= 0
                              ? 'text-success-700'
                              : 'text-red-500'
                          }`}
                        >
                          {formatCurrency(investment.gainLoss)}
                        </span>
                      </div>
                    </div>
                    <div className='text-right mt-1'>
                      <span
                        className={`p-12-regular ${
                          investment.gainLoss >= 0
                            ? 'text-success-700'
                            : 'text-red-500'
                        }`}
                      >
                        {formatPercentage(investment.gainLossPercentage)}
                      </span>
                    </div>
                  </div>

                  {/* Purchase Date */}
                  <div className='flex items-center gap-2 text-dark-600'>
                    <Calendar className='h-4 w-4' />
                    <span className='p-12-regular'>
                      Purchased: {formatDate(investment.purchaseDate)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2 pt-2 border-t border-light-400'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => navigate(`/investments/${investment.id}`)}
                      className='flex-1 border-light-400'
                    >
                      <Eye className='mr-2 h-4 w-4' />
                      View
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        navigate(`/investments/${investment.id}/edit`)
                      }
                      className='flex-1 border-light-400'
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      Edit
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDeleteClick(investment)}
                      className='border-red-300 text-red-500 hover:bg-red-50'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle className='p-24-bold text-dark-900'>
              Delete Investment
            </DialogTitle>
            <DialogDescription className='p-16-regular text-dark-600'>
              Are you sure you want to delete "{selectedInvestment?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteInvestmentMutation.isPending}
              className='border-light-400'
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteInvestmentMutation.isPending}
              className='bg-red-500 hover:bg-red-600 text-white'
            >
              {deleteInvestmentMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Investments;
