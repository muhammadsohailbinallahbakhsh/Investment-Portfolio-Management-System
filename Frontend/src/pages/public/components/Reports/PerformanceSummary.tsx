import { useState } from 'react';
import { usePerformanceSummary } from '@/api';
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
  DollarSign,
  Activity,
  Package,
  ArrowUpDown,
  ArrowLeft,
  Calendar,
  BarChart3,
  PieChart,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExportMenu } from '@/components/ExportMenu';
import { MonthlyPerformanceChart } from '@/components/charts/MonthlyPerformanceChart';
import { PerformanceByTypeChart } from '@/components/charts/PerformanceByTypeChart';
import type { ReportDateRange } from '@/types';

const PerformanceSummary = () => {
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
  } = usePerformanceSummary(dateRangeParams);

  const report = response?.data;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
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

  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
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
                There was an error loading the performance summary report.
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

  const isPositiveGain = report.totalGainLoss >= 0;

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
              <p className='p-14-regular text-dark-500 mt-1'>
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
            reportType='performance-summary'
            reportName='Performance Summary'
          />
        </div>
      </div>

      {/* Overall Performance Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Total Invested</p>
                <p className='p-24-bold text-dark-900 mt-1'>
                  {formatCurrency(report.totalInvested)}
                </p>
              </div>
              <div className='rounded-full bg-blue-100 p-3'>
                <DollarSign className='h-6 w-6 text-blue-500' />
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
                  {formatCurrency(report.currentValue)}
                </p>
              </div>
              <div className='rounded-full bg-primary-100 p-3'>
                <BarChart3 className='h-6 w-6 text-primary-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Total Gain/Loss</p>
                <p
                  className={`p-24-bold mt-1 ${
                    isPositiveGain ? 'text-success-700' : 'text-red-500'
                  }`}
                >
                  {isPositiveGain ? '+' : ''}
                  {formatCurrency(report.totalGainLoss)}
                </p>
              </div>
              <div
                className={`rounded-full p-3 ${
                  isPositiveGain ? 'bg-success-100' : 'bg-red-100'
                }`}
              >
                {isPositiveGain ? (
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
                    isPositiveGain ? 'text-success-700' : 'text-red-500'
                  }`}
                >
                  {isPositiveGain ? '+' : ''}
                  {report.totalGainLossPercentage.toFixed(2)}%
                </p>
              </div>
              <div
                className={`rounded-full p-3 ${
                  isPositiveGain ? 'bg-success-100' : 'bg-red-100'
                }`}
              >
                <Activity className='h-6 w-6 text-dark-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Investment Breakdown */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Package className='h-5 w-5 text-primary-500' />
              <CardTitle className='p-20-bold text-dark-900'>
                Investment Breakdown
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-light-200 rounded-lg p-4'>
                <p className='p-12-regular text-dark-600'>Total Investments</p>
                <p className='p-24-bold text-dark-900 mt-1'>
                  {report.totalInvestments}
                </p>
              </div>
              <div className='bg-success-100 rounded-lg p-4'>
                <p className='p-12-regular text-dark-600'>Active</p>
                <p className='p-24-bold text-success-700 mt-1'>
                  {report.activeInvestments}
                </p>
              </div>
              <div className='bg-red-100 rounded-lg p-4'>
                <p className='p-12-regular text-dark-600'>Sold</p>
                <p className='p-24-bold text-red-700 mt-1'>
                  {report.soldInvestments}
                </p>
              </div>
              <div className='bg-blue-100 rounded-lg p-4'>
                <p className='p-12-regular text-dark-600'>On Hold</p>
                <p className='p-24-bold text-blue-700 mt-1'>
                  {report.onHoldInvestments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <ArrowUpDown className='h-5 w-5 text-primary-500' />
              <CardTitle className='p-20-bold text-dark-900'>
                Transaction Summary
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div className='bg-light-200 rounded-lg p-4'>
                <p className='p-12-regular text-dark-600'>Total Transactions</p>
                <p className='p-24-bold text-dark-900 mt-1'>
                  {report.totalTransactions}
                </p>
              </div>
              <div className='flex items-center justify-between bg-success-100 rounded-lg p-4'>
                <div>
                  <p className='p-12-regular text-dark-600'>Total Buy Volume</p>
                  <p className='p-20-bold text-success-700 mt-1'>
                    {formatCurrency(report.totalBuyVolume)}
                  </p>
                </div>
                <TrendingDown className='h-6 w-6 text-success-700' />
              </div>
              <div className='flex items-center justify-between bg-red-100 rounded-lg p-4'>
                <div>
                  <p className='p-12-regular text-dark-600'>
                    Total Sell Volume
                  </p>
                  <p className='p-20-bold text-red-700 mt-1'>
                    {formatCurrency(report.totalSellVolume)}
                  </p>
                </div>
                <TrendingUp className='h-6 w-6 text-red-700' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top & Worst Performers */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Top Performers */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-success-700' />
                <CardTitle className='p-20-bold text-dark-900'>
                  Top Performers
                </CardTitle>
              </div>
              <Badge className='bg-success-100 text-success-700'>
                {report.topPerformers.length} Investments
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {report.topPerformers.length > 0 ? (
              <div className='space-y-3'>
                {report.topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-light-200 rounded-lg hover:bg-light-300 transition-colors'
                  >
                    <div>
                      <p className='p-14-semibold text-dark-900'>
                        {performer.name}
                      </p>
                      <p className='p-12-regular text-dark-600'>
                        {performer.type}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='p-14-semibold text-success-700'>
                        +{performer.gainLossPercentage.toFixed(2)}%
                      </p>
                      <p className='p-12-regular text-dark-600'>
                        {formatCurrency(performer.gainLoss)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <TrendingUp className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                <p className='p-14-regular text-dark-600'>
                  No top performers data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Worst Performers */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <TrendingDown className='h-5 w-5 text-red-500' />
                <CardTitle className='p-20-bold text-dark-900'>
                  Worst Performers
                </CardTitle>
              </div>
              <Badge className='bg-red-100 text-red-700'>
                {report.worstPerformers.length} Investments
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {report.worstPerformers.length > 0 ? (
              <div className='space-y-3'>
                {report.worstPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-light-200 rounded-lg hover:bg-light-300 transition-colors'
                  >
                    <div>
                      <p className='p-14-semibold text-dark-900'>
                        {performer.name}
                      </p>
                      <p className='p-12-regular text-dark-600'>
                        {performer.type}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='p-14-semibold text-red-500'>
                        {performer.gainLossPercentage.toFixed(2)}%
                      </p>
                      <p className='p-12-regular text-dark-600'>
                        {formatCurrency(performer.gainLoss)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <TrendingDown className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                <p className='p-14-regular text-dark-600'>
                  No worst performers data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance by Type Chart */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <PieChart className='h-5 w-5 text-primary-500' />
            <CardTitle className='p-20-bold text-dark-900'>
              Performance by Investment Type
            </CardTitle>
          </div>
          <CardDescription className='p-14-regular text-dark-600'>
            Compare performance across different investment types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceByTypeChart
            data={report.performanceByType}
            title=''
            height={400}
          />
        </CardContent>
      </Card>

      {/* Performance by Type Table */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <CardTitle className='p-20-bold text-dark-900'>
            Performance by Type - Detailed Data
          </CardTitle>
          <CardDescription className='p-14-regular text-dark-600'>
            Detailed breakdown of performance metrics by investment type
          </CardDescription>
        </CardHeader>
        <CardContent>
          {report.performanceByType.length > 0 ? (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='border-light-400'>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Type
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Count
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Invested
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Current Value
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Gain/Loss
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700 text-right'>
                      Return %
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.performanceByType.map((item, index) => {
                    const isPositive = item.gainLoss >= 0;
                    return (
                      <TableRow key={index} className='border-light-400'>
                        <TableCell className='p-14-semibold text-dark-900'>
                          {item.type}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700'>
                          {item.count}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700'>
                          {formatCurrency(item.totalInvested)}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700'>
                          {formatCurrency(item.currentValue)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`p-14-semibold ${
                              isPositive ? 'text-success-700' : 'text-red-500'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {formatCurrency(item.gainLoss)}
                          </span>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Badge
                            className={
                              isPositive
                                ? 'bg-success-100 text-success-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {isPositive ? '+' : ''}
                            {item.gainLossPercentage.toFixed(2)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='text-center py-8'>
              <PieChart className='h-12 w-12 text-dark-300 mx-auto mb-3' />
              <p className='p-14-regular text-dark-600'>
                No performance by type data available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend Chart */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5 text-primary-500' />
            <CardTitle className='p-20-bold text-dark-900'>
              Monthly Performance Trend
            </CardTitle>
          </div>
          <CardDescription className='p-14-regular text-dark-600'>
            Visualize your portfolio performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyPerformanceChart
            data={report.monthlyTrend}
            title=''
            height={400}
          />
        </CardContent>
      </Card>

      {/* Monthly Trend Table */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <CardTitle className='p-20-bold text-dark-900'>
            Monthly Performance Data
          </CardTitle>
          <CardDescription className='p-14-regular text-dark-600'>
            Detailed breakdown of monthly performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {report.monthlyTrend.length > 0 ? (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='border-light-400'>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Month
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Portfolio Value
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Invested Amount
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700'>
                      Gain/Loss
                    </TableHead>
                    <TableHead className='p-14-semibold text-dark-700 text-right'>
                      Return %
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.monthlyTrend.map((item, index) => {
                    const isPositive = item.gainLoss >= 0;
                    return (
                      <TableRow key={index} className='border-light-400'>
                        <TableCell className='p-14-semibold text-dark-900'>
                          {item.month}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700'>
                          {formatCurrency(item.value)}
                        </TableCell>
                        <TableCell className='p-14-regular text-dark-700'>
                          {formatCurrency(item.investedAmount)}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1'>
                            {isPositive ? (
                              <TrendingUp className='h-4 w-4 text-success-700' />
                            ) : (
                              <TrendingDown className='h-4 w-4 text-red-500' />
                            )}
                            <span
                              className={`p-14-semibold ${
                                isPositive ? 'text-success-700' : 'text-red-500'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {formatCurrency(item.gainLoss)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Badge
                            className={
                              isPositive
                                ? 'bg-success-100 text-success-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {isPositive ? '+' : ''}
                            {item.gainLossPercentage.toFixed(2)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='text-center py-8'>
              <BarChart3 className='h-12 w-12 text-dark-300 mx-auto mb-3' />
              <p className='p-14-regular text-dark-600'>
                No monthly trend data available
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSummary;
