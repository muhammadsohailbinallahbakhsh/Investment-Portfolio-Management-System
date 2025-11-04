import { useState } from 'react';
import { useTransactionHistory } from '@/api';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExportMenu } from '@/components/ExportMenu';
import { TransactionVolumeChart } from '@/components/charts/TransactionVolumeChart';
import type { ReportDateRange } from '@/types';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<string>('all');

  // Build date range params
  const dateRangeParams: ReportDateRange | undefined =
    dateRange === 'all'
      ? undefined
      : { presetRange: dateRange, startDate: '', endDate: '' };

  const {
    data: response,
    isLoading,
    refetch,
  } = useTransactionHistory(dateRangeParams);

  const report = response?.data;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format number
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format date with time
  const formatDateTime = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  // Get transaction type badge color
  const getTransactionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'buy':
        return 'bg-success-100 text-success-700';
      case 'sell':
        return 'bg-red-100 text-red-700';
      case 'update':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-light-200 text-dark-600';
    }
  };

  // Get transaction type icon
  const getTransactionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'buy':
        return <ArrowUpRight className='h-4 w-4' />;
      case 'sell':
        return <ArrowDownRight className='h-4 w-4' />;
      case 'update':
        return <RefreshCw className='h-4 w-4' />;
      default:
        return <Activity className='h-4 w-4' />;
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

  // No data state
  if (!report) {
    return (
      <div className='space-y-6 p-6'>
        <Card className='border-light-400'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <FileText className='h-12 w-12 text-red-500 mb-4' />
              <h3 className='p-20-bold text-dark-900 mb-2'>
                Unable to Load Report
              </h3>
              <p className='p-16-regular text-dark-600 mb-4'>
                There was an error loading the transaction history report.
              </p>
              <Button
                onClick={() => refetch()}
                className='bg-primary-500 hover:bg-primary-600'
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/reports')}
            className='border-light-400'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <div>
            <h1 className='p-32-bold text-dark-900'>{report.reportTitle}</h1>
            <p className='p-16-regular text-dark-600 mt-1'>
              Generated on {formatDate(report.generatedAt)}
            </p>
            {report.periodStart && report.periodEnd && (
              <p className='p-14-regular text-dark-600 mt-1'>
                Period: {formatDate(report.periodStart)} -{' '}
                {formatDate(report.periodEnd)}
              </p>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className='w-[180px] border-light-400'>
              <Calendar className='mr-2 h-4 w-4' />
              <SelectValue placeholder='Select period' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Time</SelectItem>
              <SelectItem value='today'>Today</SelectItem>
              <SelectItem value='this-week'>This Week</SelectItem>
              <SelectItem value='this-month'>This Month</SelectItem>
              <SelectItem value='this-quarter'>This Quarter</SelectItem>
              <SelectItem value='this-year'>This Year</SelectItem>
              <SelectItem value='last-month'>Last Month</SelectItem>
              <SelectItem value='last-quarter'>Last Quarter</SelectItem>
              <SelectItem value='last-year'>Last Year</SelectItem>
            </SelectContent>
          </Select>

          <ExportMenu
            data={report}
            reportType='transaction-history'
            reportName='Transaction History'
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Total Transactions</p>
                <p className='p-32-bold text-dark-900 mt-1'>
                  {report.totalTransactions}
                </p>
              </div>
              <div className='rounded-full bg-primary-100 p-3'>
                <Activity className='h-8 w-8 text-primary-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Total Volume</p>
                <p className='p-32-bold text-dark-900 mt-1'>
                  {formatCurrency(report.totalVolume)}
                </p>
              </div>
              <div className='rounded-full bg-blue-100 p-3'>
                <DollarSign className='h-8 w-8 text-blue-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Buy Volume</p>
                <p className='p-24-bold text-success-700 mt-1'>
                  {formatCurrency(report.buyVolume)}
                </p>
                <p className='p-12-regular text-dark-600 mt-1'>
                  {report.buyTransactions} transactions
                </p>
              </div>
              <div className='rounded-full bg-success-100 p-3'>
                <TrendingUp className='h-8 w-8 text-success-700' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Sell Volume</p>
                <p className='p-24-bold text-red-500 mt-1'>
                  {formatCurrency(report.sellVolume)}
                </p>
                <p className='p-12-regular text-dark-600 mt-1'>
                  {report.sellTransactions} transactions
                </p>
              </div>
              <div className='rounded-full bg-red-100 p-3'>
                <TrendingDown className='h-8 w-8 text-red-500' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Breakdown */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Transactions by Type */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <CardTitle className='p-20-bold text-dark-900'>
              Transactions by Type
            </CardTitle>
            <CardDescription className='p-14-regular text-dark-600'>
              Distribution of transactions across types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {report.transactionsByType.length > 0 ? (
              <div className='space-y-4'>
                {report.transactionsByType.map((item, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        {getTransactionTypeIcon(item.type)}
                        <span className='p-14-semibold text-dark-900'>
                          {item.type}
                        </span>
                        <Badge className='bg-light-200 text-dark-600'>
                          {item.count}
                        </Badge>
                      </div>
                      <span className='p-14-semibold text-dark-900'>
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className='w-full bg-light-300 rounded-full h-2'>
                      <div
                        className='h-2 rounded-full transition-all bg-primary-500'
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className='flex justify-between text-sm text-dark-600'>
                      <span>{formatCurrency(item.volume)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <Activity className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                <p className='p-14-regular text-dark-600'>
                  No transaction data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions by Month Chart */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <CardTitle className='p-20-bold text-dark-900'>
              Monthly Transaction Volume
            </CardTitle>
            <CardDescription className='p-14-regular text-dark-600'>
              Visualize transaction activity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionVolumeChart
              data={report.transactionsByMonth}
              title=''
              height={350}
            />
          </CardContent>
        </Card>

        {/* Transactions by Month Table */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <CardTitle className='p-20-bold text-dark-900'>
              Monthly Transaction Data
            </CardTitle>
            <CardDescription className='p-14-regular text-dark-600'>
              Detailed breakdown of monthly transaction metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {report.transactionsByMonth.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-light-400'>
                      <TableHead className='p-14-semibold text-dark-700'>
                        Month
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700 text-center'>
                        Count
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700 text-right'>
                        Volume
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.transactionsByMonth.map((item, index) => (
                      <TableRow key={index} className='border-light-400'>
                        <TableCell className='p-14-semibold text-dark-900'>
                          {item.month}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700 text-center'>
                          <Badge className='bg-primary-100 text-primary-700'>
                            {item.count}
                          </Badge>
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700 text-right'>
                          {formatCurrency(item.volume)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className='text-center py-8'>
                <Calendar className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                <p className='p-14-regular text-dark-600'>
                  No monthly data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Transaction List */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='p-20-bold text-dark-900'>
                Transaction Details
              </CardTitle>
              <CardDescription className='p-14-regular text-dark-600 mt-1'>
                Complete list of all transactions
              </CardDescription>
            </div>
            <Badge className='bg-primary-100 text-primary-700'>
              {report.transactions.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {report.transactions.length > 0 ? (
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
                        Investment
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700'>
                        Type
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700'>
                        Transaction
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700 text-right'>
                        Quantity
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700 text-right'>
                        Price/Unit
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700 text-right'>
                        Amount
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700'>
                        Notes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.transactions.map((transaction, index) => (
                      <TableRow key={index} className='border-light-400'>
                        <TableCell className='p-14-regular text-dark-700'>
                          {formatDateTime(transaction.date)}
                        </TableCell>
                        <TableCell className='p-14-semibold text-dark-900'>
                          {transaction.investmentName}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700'>
                          {transaction.investmentType}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getTransactionTypeColor(
                              transaction.transactionType
                            )}
                          >
                            <span className='flex items-center gap-1'>
                              {getTransactionTypeIcon(
                                transaction.transactionType
                              )}
                              {transaction.transactionType}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700 text-right'>
                          {formatNumber(transaction.quantity)}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700 text-right'>
                          {formatCurrency(transaction.pricePerUnit)}
                        </TableCell>
                        <TableCell className='p-14-semibold text-dark-900 text-right'>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-600 max-w-[200px] truncate'>
                          {transaction.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className='md:hidden space-y-4'>
                {report.transactions.map((transaction, index) => (
                  <Card key={index} className='border-light-400'>
                    <CardContent className='pt-4'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <p className='p-16-semibold text-dark-900'>
                            {transaction.investmentName}
                          </p>
                          <p className='p-12-regular text-dark-600 mt-1'>
                            {transaction.investmentType}
                          </p>
                          <p className='p-12-regular text-dark-600 mt-1'>
                            {formatDateTime(transaction.date)}
                          </p>
                        </div>
                        <Badge
                          className={getTransactionTypeColor(
                            transaction.transactionType
                          )}
                        >
                          <span className='flex items-center gap-1'>
                            {getTransactionTypeIcon(
                              transaction.transactionType
                            )}
                            {transaction.transactionType}
                          </span>
                        </Badge>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='p-12-regular text-dark-600'>
                            Quantity:
                          </span>
                          <span className='p-14-semibold text-dark-900'>
                            {formatNumber(transaction.quantity)}
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
                          <span className='p-12-regular text-dark-600'>
                            Total Amount:
                          </span>
                          <span className='p-16-semibold text-primary-500'>
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        {transaction.notes && (
                          <div className='pt-2 border-t border-light-400'>
                            <p className='p-12-regular text-dark-600'>Notes:</p>
                            <p className='p-14-regular text-dark-900 mt-1'>
                              {transaction.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className='text-center py-8'>
              <FileText className='h-12 w-12 text-dark-300 mx-auto mb-3' />
              <p className='p-14-regular text-dark-600'>
                No transactions found
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
