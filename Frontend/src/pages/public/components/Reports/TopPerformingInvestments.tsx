import { useState } from 'react';
import { useTopPerformingInvestments } from '@/api';
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
  TrendingUp,
  TrendingDown,
  Medal,
  ArrowLeft,
  Calendar,
  BarChart3,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExportMenu } from '@/components/ExportMenu';
import type { ReportDateRange } from '@/types';

const TopPerformingInvestments = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<string>('all');
  const [count, setCount] = useState<number>(10);

  // Build date range params
  const dateRangeParams: ReportDateRange | undefined =
    dateRange === 'all'
      ? undefined
      : { presetRange: dateRange, startDate: '', endDate: '' };

  const {
    data: response,
    isLoading,
    refetch,
  } = useTopPerformingInvestments(dateRangeParams, count);

  const report = response?.data;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    const formatted = value.toFixed(2);
    return `${value >= 0 ? '+' : ''}${formatted}%`;
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

  // Format date time
  const formatDateTime = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get medal icon
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Medal className='h-5 w-5 text-yellow-500' />;
    if (rank === 2) return <Medal className='h-5 w-5 text-gray-400' />;
    if (rank === 3) return <Medal className='h-5 w-5 text-amber-600' />;
    return <span className='text-sm text-gray-500'>#{rank}</span>;
  };

  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  // Handle count change
  const handleCountChange = (value: string) => {
    setCount(parseInt(value));
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
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Investments</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <Target className='h-16 w-16 text-gray-300 mb-4' />
            <p className='text-gray-500 mb-4'>
              No investment performance data found. Start investing to see your
              top performers!
            </p>
            <Button onClick={() => navigate('/investments/add')}>
              Add Investment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => navigate('/reports')}
                  className='gap-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back to Reports
                </Button>
              </div>
              <CardTitle className='text-2xl'>{report.reportTitle}</CardTitle>
              <CardDescription className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                Generated on {formatDateTime(report.generatedAt)}
                {report.periodStart && report.periodEnd && (
                  <span className='ml-2'>
                    • Period: {formatDate(report.periodStart)} -{' '}
                    {formatDate(report.periodEnd)}
                  </span>
                )}
              </CardDescription>
            </div>
            <ExportMenu
              data={report}
              reportType='top-performing-investments'
              reportName='Top Performing Investments'
            />
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <label className='text-sm font-medium mb-2 block'>
                Date Range
              </label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select date range' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Time</SelectItem>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='last7days'>Last 7 Days</SelectItem>
                  <SelectItem value='last30days'>Last 30 Days</SelectItem>
                  <SelectItem value='last90days'>Last 90 Days</SelectItem>
                  <SelectItem value='thisMonth'>This Month</SelectItem>
                  <SelectItem value='lastMonth'>Last Month</SelectItem>
                  <SelectItem value='thisYear'>This Year</SelectItem>
                  <SelectItem value='lastYear'>Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex-1'>
              <label className='text-sm font-medium mb-2 block'>
                Number of Results
              </label>
              <Select
                value={count.toString()}
                onValueChange={handleCountChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select count' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='5'>Top 5</SelectItem>
                  <SelectItem value='10'>Top 10</SelectItem>
                  <SelectItem value='15'>Top 15</SelectItem>
                  <SelectItem value='20'>Top 20</SelectItem>
                  <SelectItem value='25'>Top 25</SelectItem>
                  <SelectItem value='50'>Top 50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-end'>
              <Button
                onClick={() => refetch()}
                variant='outline'
                className='gap-2'
              >
                <BarChart3 className='h-4 w-4' />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className='grid grid-cols-1 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>
                  Total Investments Analyzed
                </p>
                <p className='text-2xl font-bold text-primary-500'>
                  {report.totalInvestmentsAnalyzed}
                </p>
              </div>
              <Target className='h-12 w-12 text-primary-200' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top by Percentage */}
      {report.topByPercentage && report.topByPercentage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performers by Gain/Loss Percentage</CardTitle>
            <CardDescription>
              Investments ranked by percentage return on investment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-16'>Rank</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Initial Amount</TableHead>
                    <TableHead className='text-right'>Current Value</TableHead>
                    <TableHead className='text-right'>Gain/Loss</TableHead>
                    <TableHead className='text-right'>Return %</TableHead>
                    <TableHead className='text-right'>
                      Annualized Return
                    </TableHead>
                    <TableHead className='text-right'>Days Held</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.topByPercentage.map((item) => (
                    <TableRow key={item.rank}>
                      <TableCell>
                        <div className='flex items-center justify-center'>
                          {getMedalIcon(item.rank)}
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>{item.name}</TableCell>
                      <TableCell>
                        <Badge variant='outline'>{item.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'Active' ? 'default' : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(item.initialAmount)}
                      </TableCell>
                      <TableCell className='text-right font-semibold'>
                        {formatCurrency(item.currentValue)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={
                            item.gainLoss >= 0
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {formatCurrency(item.gainLoss)}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          {item.gainLossPercentage >= 0 ? (
                            <TrendingUp className='h-4 w-4 text-green-600' />
                          ) : (
                            <TrendingDown className='h-4 w-4 text-red-600' />
                          )}
                          <span
                            className={
                              item.gainLossPercentage >= 0
                                ? 'text-green-600 font-bold'
                                : 'text-red-600 font-bold'
                            }
                          >
                            {formatPercentage(item.gainLossPercentage)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={
                            item.annualizedReturn >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {formatPercentage(item.annualizedReturn)}
                        </span>
                      </TableCell>
                      <TableCell className='text-right text-sm text-gray-600'>
                        {item.daysHeld}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top by Absolute Gain */}
      {report.topByAbsoluteGain && report.topByAbsoluteGain.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performers by Absolute Gain</CardTitle>
            <CardDescription>
              Investments ranked by dollar value gained
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-16'>Rank</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Initial Amount</TableHead>
                    <TableHead className='text-right'>Current Value</TableHead>
                    <TableHead className='text-right'>Gain/Loss</TableHead>
                    <TableHead className='text-right'>Return %</TableHead>
                    <TableHead>Purchase Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.topByAbsoluteGain.map((item) => (
                    <TableRow key={item.rank}>
                      <TableCell>
                        <div className='flex items-center justify-center'>
                          {getMedalIcon(item.rank)}
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>{item.name}</TableCell>
                      <TableCell>
                        <Badge variant='outline'>{item.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'Active' ? 'default' : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(item.initialAmount)}
                      </TableCell>
                      <TableCell className='text-right font-semibold'>
                        {formatCurrency(item.currentValue)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={
                            item.gainLoss >= 0
                              ? 'text-green-600 font-bold text-lg'
                              : 'text-red-600 font-bold text-lg'
                          }
                        >
                          {formatCurrency(item.gainLoss)}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          {item.gainLossPercentage >= 0 ? (
                            <TrendingUp className='h-4 w-4 text-green-600' />
                          ) : (
                            <TrendingDown className='h-4 w-4 text-red-600' />
                          )}
                          <span
                            className={
                              item.gainLossPercentage >= 0
                                ? 'text-green-600 font-semibold'
                                : 'text-red-600 font-semibold'
                            }
                          >
                            {formatPercentage(item.gainLossPercentage)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top by Value */}
      {report.topByValue && report.topByValue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Investments by Current Value</CardTitle>
            <CardDescription>
              Largest investments by total portfolio value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-16'>Rank</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Initial Amount</TableHead>
                    <TableHead className='text-right'>Current Value</TableHead>
                    <TableHead className='text-right'>Gain/Loss</TableHead>
                    <TableHead className='text-right'>Return %</TableHead>
                    <TableHead>Purchase Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.topByValue.map((item) => (
                    <TableRow key={item.rank}>
                      <TableCell>
                        <div className='flex items-center justify-center'>
                          {getMedalIcon(item.rank)}
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>{item.name}</TableCell>
                      <TableCell>
                        <Badge variant='outline'>{item.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'Active' ? 'default' : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(item.initialAmount)}
                      </TableCell>
                      <TableCell className='text-right font-bold text-lg text-primary-600'>
                        {formatCurrency(item.currentValue)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={
                            item.gainLoss >= 0
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {formatCurrency(item.gainLoss)}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          {item.gainLossPercentage >= 0 ? (
                            <TrendingUp className='h-4 w-4 text-green-600' />
                          ) : (
                            <TrendingDown className='h-4 w-4 text-red-600' />
                          )}
                          <span
                            className={
                              item.gainLossPercentage >= 0
                                ? 'text-green-600 font-semibold'
                                : 'text-red-600 font-semibold'
                            }
                          >
                            {formatPercentage(item.gainLossPercentage)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Type Performance Summary */}
      {report.typePerformanceSummaries &&
        report.typePerformanceSummaries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance by Investment Type</CardTitle>
              <CardDescription>
                Average performance metrics across different investment types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment Type</TableHead>
                      <TableHead className='text-center'>
                        # of Investments
                      </TableHead>
                      <TableHead className='text-right'>
                        Avg. Return %
                      </TableHead>
                      <TableHead className='text-right'>
                        Best Performance
                      </TableHead>
                      <TableHead className='text-right'>
                        Worst Performance
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.typePerformanceSummaries.map((summary) => (
                      <TableRow key={summary.type}>
                        <TableCell className='font-medium'>
                          <Badge variant='outline' className='text-sm'>
                            {summary.type}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-center'>
                          <Badge variant='secondary'>{summary.count}</Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <span
                            className={
                              summary.averageGainLossPercentage >= 0
                                ? 'text-green-600 font-semibold'
                                : 'text-red-600 font-semibold'
                            }
                          >
                            {formatPercentage(
                              summary.averageGainLossPercentage
                            )}
                          </span>
                        </TableCell>
                        <TableCell className='text-right'>
                          <span className='text-green-600 font-semibold'>
                            {formatPercentage(
                              summary.bestPerformancePercentage
                            )}
                          </span>
                        </TableCell>
                        <TableCell className='text-right'>
                          <span className='text-red-600 font-semibold'>
                            {formatPercentage(
                              summary.worstPerformancePercentage
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default TopPerformingInvestments;
