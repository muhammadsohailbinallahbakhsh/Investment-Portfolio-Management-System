import { useState } from 'react';
import { useInvestmentDistribution } from '@/api';
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
  PieChart,
  Calendar,
  DollarSign,
  Package,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExportMenu } from '@/components/ExportMenu';
import { InvestmentDistributionPieChart } from '@/components/charts/InvestmentDistributionPieChart';
import type { ReportDateRange } from '@/types';

const InvestmentDistribution = () => {
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
  } = useInvestmentDistribution(dateRangeParams);

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
                There was an error loading the investment distribution report.
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
            reportType='investment-distribution'
            reportName='Investment Distribution'
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>
                  Total Portfolio Value
                </p>
                <p className='p-32-bold text-dark-900 mt-1'>
                  {formatCurrency(report.totalPortfolioValue)}
                </p>
              </div>
              <div className='rounded-full bg-primary-100 p-3'>
                <DollarSign className='h-8 w-8 text-primary-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Total Investments</p>
                <p className='p-32-bold text-dark-900 mt-1'>
                  {report.totalInvestments}
                </p>
              </div>
              <div className='rounded-full bg-blue-100 p-3'>
                <Package className='h-8 w-8 text-blue-500' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Pie Charts */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Distribution by Type Pie Chart */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <PieChart className='h-5 w-5 text-primary-500' />
              <CardTitle className='p-20-bold text-dark-900'>
                Distribution by Type
              </CardTitle>
            </div>
            <CardDescription className='p-14-regular text-dark-600'>
              Portfolio allocation across investment types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentDistributionPieChart
              data={report.distributionByType}
              title=''
              height={350}
              showLegend={false}
            />
          </CardContent>
        </Card>

        {/* Distribution by Status Pie Chart */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <PieChart className='h-5 w-5 text-primary-500' />
              <CardTitle className='p-20-bold text-dark-900'>
                Distribution by Status
              </CardTitle>
            </div>
            <CardDescription className='p-14-regular text-dark-600'>
              Portfolio allocation across investment statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentDistributionPieChart
              data={report.distributionByStatus}
              title=''
              height={350}
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Distribution Details */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Distribution by Type Details */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <CardTitle className='p-20-bold text-dark-900'>
              Type Distribution - Details
            </CardTitle>
            <CardDescription className='p-14-regular text-dark-600'>
              Detailed breakdown by investment type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {report.distributionByType.length > 0 ? (
              <div className='space-y-4'>
                {report.distributionByType.map((item, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-4 h-4 rounded-full'
                          style={{ backgroundColor: item.color || '#3B82F6' }}
                        />
                        <span className='p-14-semibold text-dark-900'>
                          {item.category}
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
                        className='h-2 rounded-full transition-all'
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color || '#3B82F6',
                        }}
                      />
                    </div>
                    <div className='flex justify-between text-sm text-dark-600'>
                      <span>{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <PieChart className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                <p className='p-14-regular text-dark-600'>
                  No distribution data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribution by Status Details */}
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <CardTitle className='p-20-bold text-dark-900'>
              Status Distribution - Details
            </CardTitle>
            <CardDescription className='p-14-regular text-dark-600'>
              Detailed breakdown by investment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {report.distributionByStatus.length > 0 ? (
              <div className='space-y-4'>
                {report.distributionByStatus.map((item, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-4 h-4 rounded-full'
                          style={{ backgroundColor: item.color || '#3B82F6' }}
                        />
                        <span className='p-14-semibold text-dark-900'>
                          {item.category}
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
                        className='h-2 rounded-full transition-all'
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color || '#3B82F6',
                        }}
                      />
                    </div>
                    <div className='flex justify-between text-sm text-dark-600'>
                      <span>{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <PieChart className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                <p className='p-14-regular text-dark-600'>
                  No distribution data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Investment Size Distribution */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Package className='h-5 w-5 text-primary-500' />
            <CardTitle className='p-20-bold text-dark-900'>
              Investment Size Distribution
            </CardTitle>
          </div>
          <CardDescription className='p-14-regular text-dark-600'>
            Distribution of investments by value ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {report.investmentSizeDistribution.length > 0 ? (
            <div className='space-y-4'>
              {report.investmentSizeDistribution.map((item, index) => (
                <div key={index} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='p-14-semibold text-dark-900'>
                        {item.range}
                      </span>
                      <Badge className='bg-primary-100 text-primary-700'>
                        {item.count}{' '}
                        {item.count === 1 ? 'Investment' : 'Investments'}
                      </Badge>
                    </div>
                    <span className='p-14-semibold text-dark-900'>
                      {formatCurrency(item.totalValue)}
                    </span>
                  </div>
                  <div className='w-full bg-light-300 rounded-full h-2'>
                    <div
                      className='bg-primary-500 h-2 rounded-full transition-all'
                      style={{
                        width: `${
                          (item.totalValue / report.totalPortfolioValue) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <Package className='h-12 w-12 text-dark-300 mx-auto mb-3' />
              <p className='p-14-regular text-dark-600'>
                No size distribution data available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Details Table */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='p-20-bold text-dark-900'>
                All Investments
              </CardTitle>
              <CardDescription className='p-14-regular text-dark-600 mt-1'>
                Complete list of investments with performance metrics
              </CardDescription>
            </div>
            <Badge className='bg-primary-100 text-primary-700'>
              {report.investments.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {report.investments.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className='hidden md:block overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-light-400'>
                      <TableHead className='p-14-semibold text-dark-700'>
                        Name
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700'>
                        Type
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700'>
                        Status
                      </TableHead>
                      <TableHead className='p-14-semibold text-dark-700'>
                        Initial Amount
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
                    {report.investments.map((investment, index) => {
                      const isPositive = investment.gainLoss >= 0;
                      return (
                        <TableRow key={index} className='border-light-400'>
                          <TableCell className='p-14-semibold text-dark-900'>
                            {investment.name}
                          </TableCell>
                          <TableCell className='p-14-regular text-dark-700'>
                            {investment.type}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(investment.status)}
                            >
                              {investment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className='p-14-regular text-dark-700'>
                            {formatCurrency(investment.initialAmount)}
                          </TableCell>
                          <TableCell className='p-14-regular text-dark-700'>
                            {formatCurrency(investment.currentValue)}
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
                                  isPositive
                                    ? 'text-success-700'
                                    : 'text-red-500'
                                }`}
                              >
                                {isPositive ? '+' : ''}
                                {formatCurrency(investment.gainLoss)}
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
                              {investment.gainLossPercentage.toFixed(2)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className='md:hidden space-y-4'>
                {report.investments.map((investment, index) => {
                  const isPositive = investment.gainLoss >= 0;
                  return (
                    <Card key={index} className='border-light-400'>
                      <CardContent className='pt-4'>
                        <div className='flex items-start justify-between mb-3'>
                          <div>
                            <p className='p-16-semibold text-dark-900'>
                              {investment.name}
                            </p>
                            <p className='p-12-regular text-dark-600 mt-1'>
                              {investment.type}
                            </p>
                          </div>
                          <Badge className={getStatusColor(investment.status)}>
                            {investment.status}
                          </Badge>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex justify-between'>
                            <span className='p-12-regular text-dark-600'>
                              Initial:
                            </span>
                            <span className='p-14-semibold text-dark-900'>
                              {formatCurrency(investment.initialAmount)}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='p-12-regular text-dark-600'>
                              Current:
                            </span>
                            <span className='p-14-semibold text-dark-900'>
                              {formatCurrency(investment.currentValue)}
                            </span>
                          </div>
                          <div className='flex justify-between pt-2 border-t border-light-400'>
                            <span className='p-12-regular text-dark-600'>
                              Gain/Loss:
                            </span>
                            <div className='flex items-center gap-1'>
                              {isPositive ? (
                                <TrendingUp className='h-4 w-4 text-success-700' />
                              ) : (
                                <TrendingDown className='h-4 w-4 text-red-500' />
                              )}
                              <span
                                className={`p-14-semibold ${
                                  isPositive
                                    ? 'text-success-700'
                                    : 'text-red-500'
                                }`}
                              >
                                {isPositive ? '+' : ''}
                                {formatCurrency(investment.gainLoss)} (
                                {investment.gainLossPercentage.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <div className='text-center py-8'>
              <Package className='h-12 w-12 text-dark-300 mx-auto mb-3' />
              <p className='p-14-regular text-dark-600'>No investments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentDistribution;
