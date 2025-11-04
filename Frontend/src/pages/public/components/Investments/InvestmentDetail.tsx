import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvestment, useDeleteInvestment } from '@/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Package,
  Building2,
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  BarChart3,
  History,
} from 'lucide-react';
import type { InvestmentDetail as InvestmentDetailType } from '@/types';

const InvestmentDetail = () => {
  const { investmentId: paramId } = useParams<{ investmentId: string }>();
  const navigate = useNavigate();
  const investmentId = parseInt(paramId || '0');

  const { data: response, isLoading, error } = useInvestment(investmentId);
  const deleteInvestmentMutation = useDeleteInvestment();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const investment = response?.data as InvestmentDetailType | undefined;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle delete
  const handleDelete = () => {
    deleteInvestmentMutation.mutate(investmentId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        navigate('/investments');
      },
    });
  };

  // Get transaction type icon and color
  const getTransactionStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'buy':
        return {
          icon: ArrowDownRight,
          color: 'text-success-700',
          bg: 'bg-success-100',
        };
      case 'sell':
        return {
          icon: ArrowUpRight,
          color: 'text-red-500',
          bg: 'bg-red-100',
        };
      case 'update':
        return {
          icon: RefreshCw,
          color: 'text-blue-500',
          bg: 'bg-blue-100',
        };
      default:
        return {
          icon: RefreshCw,
          color: 'text-dark-600',
          bg: 'bg-light-200',
        };
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success-100 text-success-700';
      case 'sold':
        return 'bg-red-100 text-red-700';
      case 'watchlist':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-light-200 text-dark-600';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-primary-500' />
      </div>
    );
  }

  // Error state
  if (error || !investment) {
    return (
      <div className='space-y-6 p-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/investments')}
            className='border-light-400'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
        </div>
        <Card className='border-light-400'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <FileText className='h-12 w-12 text-red-500 mb-4' />
              <h3 className='p-20-bold text-dark-900 mb-2'>
                Investment Not Found
              </h3>
              <p className='p-16-regular text-dark-600 mb-4'>
                The investment you're looking for doesn't exist or has been
                deleted.
              </p>
              <Button
                onClick={() => navigate('/investments')}
                className='bg-primary-500 hover:bg-primary-600'
              >
                Back to Investments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gainLoss = investment.currentValue - investment.initialAmount;
  const gainLossPercentage =
    investment.initialAmount > 0
      ? ((gainLoss / investment.initialAmount) * 100).toFixed(2)
      : '0.00';
  const isPositive = gainLoss >= 0;

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/investments')}
            className='border-light-400'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='p-32-bold text-dark-900'>{investment.name}</h1>
              <Badge className={getStatusColor(investment.status)}>
                {investment.status}
              </Badge>
            </div>
            <p className='p-16-regular text-dark-600 mt-1'>
              {investment.type} • {investment.portfolioName || 'No Portfolio'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => navigate(`/investments/${investment.id}/edit`)}
            className='border-light-400'
          >
            <Edit className='mr-2 h-4 w-4' />
            Edit
          </Button>
          <Button
            variant='outline'
            onClick={() => setDeleteDialogOpen(true)}
            className='border-red-300 text-red-500 hover:bg-red-50'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Initial Amount</p>
                <p className='p-24-bold text-dark-900 mt-1'>
                  {formatCurrency(investment.initialAmount)}
                </p>
              </div>
              <div className='rounded-full bg-primary-100 p-3'>
                <DollarSign className='h-6 w-6 text-primary-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Current Value</p>
                <p className='p-24-bold text-dark-900 mt-1'>
                  {formatCurrency(investment.currentValue)}
                </p>
              </div>
              <div className='rounded-full bg-blue-100 p-3'>
                <BarChart3 className='h-6 w-6 text-blue-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Gain/Loss</p>
                <p
                  className={`p-24-bold mt-1 ${
                    isPositive ? 'text-success-700' : 'text-red-500'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {formatCurrency(gainLoss)}
                </p>
              </div>
              <div
                className={`rounded-full p-3 ${
                  isPositive ? 'bg-success-100' : 'bg-red-100'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className='h-6 w-6 text-success-700' />
                ) : (
                  <TrendingDown className='h-6 w-6 text-red-500' />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Return %</p>
                <p
                  className={`p-24-bold mt-1 ${
                    isPositive ? 'text-success-700' : 'text-red-500'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {gainLossPercentage}%
                </p>
              </div>
              <div
                className={`rounded-full p-3 ${
                  isPositive ? 'bg-success-100' : 'bg-red-100'
                }`}
              >
                <TrendingUp
                  className={`h-6 w-6 ${
                    isPositive ? 'text-success-700' : 'text-red-500'
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Investment Details */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Basic Information */}
          <Card className='border-light-400 shadow-100'>
            <CardHeader>
              <CardTitle className='p-20-bold text-dark-900'>
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-start gap-3'>
                  <Calendar className='h-5 w-5 text-dark-500 mt-0.5' />
                  <div>
                    <p className='p-12-regular text-dark-600'>Purchase Date</p>
                    <p className='p-16-semibold text-dark-900'>
                      {formatDate(investment.purchaseDate)}
                    </p>
                  </div>
                </div>

                {investment.quantity !== null &&
                  investment.quantity !== undefined && (
                    <div className='flex items-start gap-3'>
                      <Package className='h-5 w-5 text-dark-500 mt-0.5' />
                      <div>
                        <p className='p-12-regular text-dark-600'>Quantity</p>
                        <p className='p-16-semibold text-dark-900'>
                          {investment.quantity.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                {investment.averagePricePerUnit !== null &&
                  investment.averagePricePerUnit !== undefined && (
                    <div className='flex items-start gap-3'>
                      <DollarSign className='h-5 w-5 text-dark-500 mt-0.5' />
                      <div>
                        <p className='p-12-regular text-dark-600'>
                          Avg. Price/Unit
                        </p>
                        <p className='p-16-semibold text-dark-900'>
                          {formatCurrency(investment.averagePricePerUnit)}
                        </p>
                      </div>
                    </div>
                  )}

                {investment.brokerPlatform && (
                  <div className='flex items-start gap-3'>
                    <Building2 className='h-5 w-5 text-dark-500 mt-0.5' />
                    <div>
                      <p className='p-12-regular text-dark-600'>
                        Broker Platform
                      </p>
                      <p className='p-16-semibold text-dark-900'>
                        {investment.brokerPlatform}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {investment.notes && (
                <div className='pt-4 border-t border-light-400'>
                  <div className='flex items-start gap-3'>
                    <FileText className='h-5 w-5 text-dark-500 mt-0.5' />
                    <div>
                      <p className='p-12-regular text-dark-600'>Notes</p>
                      <p className='p-14-regular text-dark-700 mt-1'>
                        {investment.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className='pt-4 border-t border-light-400'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-dark-600'>Created:</span>
                    <span className='ml-2 font-semibold text-dark-900'>
                      {formatDate(investment.createdAt)}
                    </span>
                  </div>
                  {investment.updatedAt && (
                    <div>
                      <span className='text-dark-600'>Last Updated:</span>
                      <span className='ml-2 font-semibold text-dark-900'>
                        {formatDate(investment.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className='border-light-400 shadow-100'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='p-20-bold text-dark-900 flex items-center gap-2'>
                    <History className='h-5 w-5' />
                    Transaction History
                  </CardTitle>
                  <CardDescription className='p-14-regular text-dark-600 mt-1'>
                    {investment.transactions?.length || 0} transactions
                  </CardDescription>
                </div>
                <Button
                  size='sm'
                  onClick={() => navigate('/transactions/add')}
                  className='bg-primary-500 hover:bg-primary-600'
                >
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {investment.transactions && investment.transactions.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className='hidden md:block overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow className='border-light-400'>
                          <TableHead className='p-14-semibold text-dark-700'>
                            Date
                          </TableHead>
                          <TableHead className='p-14-semibold text-dark-700'>
                            Type
                          </TableHead>
                          <TableHead className='p-14-semibold text-dark-700'>
                            Quantity
                          </TableHead>
                          <TableHead className='p-14-semibold text-dark-700'>
                            Price/Unit
                          </TableHead>
                          <TableHead className='p-14-semibold text-dark-700 text-right'>
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {investment.transactions.map((transaction) => {
                          const style = getTransactionStyle(transaction.type);
                          const Icon = style.icon;
                          return (
                            <TableRow
                              key={transaction.id}
                              className='border-light-400'
                            >
                              <TableCell className='p-14-regular text-dark-700'>
                                {formatDate(transaction.transactionDate)}
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center gap-2'>
                                  <div
                                    className={`${style.bg} rounded-full p-1.5`}
                                  >
                                    <Icon
                                      className={`h-3 w-3 ${style.color}`}
                                    />
                                  </div>
                                  <span
                                    className={`p-14-semibold ${style.color}`}
                                  >
                                    {transaction.type}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className='p-14-regular text-dark-700'>
                                {transaction.quantity.toLocaleString()}
                              </TableCell>
                              <TableCell className='p-14-regular text-dark-700'>
                                {formatCurrency(transaction.pricePerUnit)}
                              </TableCell>
                              <TableCell className='p-14-semibold text-dark-900 text-right'>
                                {formatCurrency(transaction.amount)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className='md:hidden space-y-3'>
                    {investment.transactions.map((transaction) => {
                      const style = getTransactionStyle(transaction.type);
                      const Icon = style.icon;
                      return (
                        <Card key={transaction.id} className='border-light-400'>
                          <CardContent className='pt-4'>
                            <div className='flex items-start justify-between mb-3'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`${style.bg} rounded-full p-1.5`}
                                >
                                  <Icon className={`h-3 w-3 ${style.color}`} />
                                </div>
                                <span
                                  className={`p-14-semibold ${style.color}`}
                                >
                                  {transaction.type}
                                </span>
                              </div>
                              <span className='p-12-regular text-dark-600'>
                                {formatDate(transaction.transactionDate)}
                              </span>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex justify-between'>
                                <span className='p-12-regular text-dark-600'>
                                  Quantity:
                                </span>
                                <span className='p-14-semibold text-dark-900'>
                                  {transaction.quantity.toLocaleString()}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='p-12-regular text-dark-600'>
                                  Price/Unit:
                                </span>
                                <span className='p-14-semibold text-dark-900'>
                                  {formatCurrency(transaction.pricePerUnit)}
                                </span>
                              </div>
                              <div className='flex justify-between pt-2 border-t border-light-400'>
                                <span className='p-14-semibold text-dark-700'>
                                  Total:
                                </span>
                                <span className='p-16-bold text-dark-900'>
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                            </div>
                            {transaction.notes && (
                              <div className='mt-3 pt-3 border-t border-light-400'>
                                <p className='p-12-regular text-dark-600'>
                                  {transaction.notes}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className='text-center py-12'>
                  <History className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                  <p className='p-16-semibold text-dark-700 mb-2'>
                    No Transactions Yet
                  </p>
                  <p className='p-14-regular text-dark-600 mb-4'>
                    Start tracking your investment activity
                  </p>
                  <Button
                    size='sm'
                    onClick={() => navigate('/transactions/add')}
                    className='bg-primary-500 hover:bg-primary-600'
                  >
                    Add First Transaction
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <div className='lg:col-span-1'>
          <Card className='border-light-400 shadow-100'>
            <CardHeader>
              <CardTitle className='p-18-bold text-dark-900'>
                Performance Overview
              </CardTitle>
              <CardDescription className='p-14-regular text-dark-600'>
                Value progression over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {investment.performanceHistory &&
              investment.performanceHistory.length > 0 ? (
                <div className='space-y-3'>
                  {investment.performanceHistory.map((point, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-light-200 rounded-lg'
                    >
                      <span className='p-12-regular text-dark-600'>
                        {formatDate(point.date)}
                      </span>
                      <span className='p-14-semibold text-dark-900'>
                        {formatCurrency(point.value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <BarChart3 className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                  <p className='p-14-regular text-dark-600'>
                    No performance data available yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Investment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{investment.name}"? This action
              cannot be undone and will also delete all associated transactions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteInvestmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleteInvestmentMutation.isPending}
            >
              {deleteInvestmentMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentDetail;
