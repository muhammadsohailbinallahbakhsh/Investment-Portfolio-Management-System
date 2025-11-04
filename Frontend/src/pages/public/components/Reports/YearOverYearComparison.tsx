import { useYearOverYear } from '@/api';
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
  Calendar,
  ArrowLeft,
  Award,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExportMenu } from '@/components/ExportMenu';
import { YearOverYearChart } from '@/components/charts/YearOverYearChart';

const YearOverYearComparison = () => {
  const navigate = useNavigate();

  const { data: response, isLoading, refetch } = useYearOverYear();

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
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <CardTitle>Year-over-Year Comparison</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <BarChart3 className='h-16 w-16 text-gray-300 mb-4' />
            <p className='text-gray-500 mb-4'>
              No year-over-year data found. Start investing to see your yearly
              performance comparison!
            </p>
            <Button onClick={() => navigate('/investments/create')}>
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
                Generated on {formatDate(report.generatedAt)}
              </CardDescription>
            </div>
            <ExportMenu
              data={report}
              reportType='year-over-year'
              reportName='Year-over-Year Comparison'
            />
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Cards */}
      {(report.bestYear || report.worstYear) && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Best Year */}
          {report.bestYear && (
            <Card className='border-green-200 bg-green-50'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <Award className='h-5 w-5 text-green-600' />
                    Best Performing Year
                  </CardTitle>
                  <Badge className='bg-green-600 text-white'>
                    {report.bestYear.year}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>
                      Starting Value
                    </span>
                    <span className='font-semibold'>
                      {formatCurrency(report.bestYear.startingValue)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Ending Value</span>
                    <span className='font-semibold'>
                      {formatCurrency(report.bestYear.endingValue)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center pt-2 border-t border-green-200'>
                    <span className='text-sm text-gray-600'>Growth</span>
                    <div className='text-right'>
                      <div className='font-bold text-green-600'>
                        {formatCurrency(report.bestYear.growth)}
                      </div>
                      <div className='text-xs text-green-600'>
                        {formatPercentage(report.bestYear.growthPercentage)}
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between items-center text-xs text-gray-500 pt-2'>
                    <span>
                      {report.bestYear.totalTransactions} transactions
                    </span>
                    <span>
                      {report.bestYear.newInvestments} new investments
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Worst Year */}
          {report.worstYear && (
            <Card className='border-red-200 bg-red-50'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <AlertTriangle className='h-5 w-5 text-red-600' />
                    Challenging Year
                  </CardTitle>
                  <Badge variant='destructive'>{report.worstYear.year}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>
                      Starting Value
                    </span>
                    <span className='font-semibold'>
                      {formatCurrency(report.worstYear.startingValue)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Ending Value</span>
                    <span className='font-semibold'>
                      {formatCurrency(report.worstYear.endingValue)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center pt-2 border-t border-red-200'>
                    <span className='text-sm text-gray-600'>Growth</span>
                    <div className='text-right'>
                      <div className='font-bold text-red-600'>
                        {formatCurrency(report.worstYear.growth)}
                      </div>
                      <div className='text-xs text-red-600'>
                        {formatPercentage(report.worstYear.growthPercentage)}
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between items-center text-xs text-gray-500 pt-2'>
                    <span>
                      {report.worstYear.totalTransactions} transactions
                    </span>
                    <span>
                      {report.worstYear.newInvestments} new investments
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Year-over-Year Chart */}
      {report.yearlySummaries && report.yearlySummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Year-over-Year Performance Trend</CardTitle>
            <CardDescription>
              Compare portfolio performance across {report.yearsCovered.length}{' '}
              {report.yearsCovered.length === 1 ? 'year' : 'years'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <YearOverYearChart
              data={report.yearlySummaries}
              height={400}
              title=''
            />
          </CardContent>
        </Card>
      )}

      {/* Yearly Summaries Table */}
      {report.yearlySummaries && report.yearlySummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Yearly Performance</CardTitle>
            <CardDescription>
              Complete breakdown of portfolio performance by year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className='text-right'>Starting Value</TableHead>
                    <TableHead className='text-right'>Ending Value</TableHead>
                    <TableHead className='text-right'>Total Invested</TableHead>
                    <TableHead className='text-right'>Growth</TableHead>
                    <TableHead className='text-right'>Growth %</TableHead>
                    <TableHead className='text-center'>Transactions</TableHead>
                    <TableHead className='text-center'>
                      New Investments
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.yearlySummaries.map((year) => (
                    <TableRow key={year.year}>
                      <TableCell className='font-medium'>
                        <Badge variant='outline'>{year.year}</Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(year.startingValue)}
                      </TableCell>
                      <TableCell className='text-right font-semibold'>
                        {formatCurrency(year.endingValue)}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(year.totalInvested)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={
                            year.growth >= 0
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {formatCurrency(year.growth)}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          {year.growthPercentage >= 0 ? (
                            <TrendingUp className='h-4 w-4 text-green-600' />
                          ) : (
                            <TrendingDown className='h-4 w-4 text-red-600' />
                          )}
                          <span
                            className={
                              year.growthPercentage >= 0
                                ? 'text-green-600 font-semibold'
                                : 'text-red-600 font-semibold'
                            }
                          >
                            {formatPercentage(year.growthPercentage)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge variant='secondary'>
                          {year.totalTransactions}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge variant='secondary'>{year.newInvestments}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Year-over-Year Growth Comparison */}
      {report.yearOverYearGrowth && report.yearOverYearGrowth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Year-over-Year Growth Analysis</CardTitle>
            <CardDescription>
              Compare consecutive years to identify trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comparison</TableHead>
                    <TableHead className='text-right'>
                      Growth Difference
                    </TableHead>
                    <TableHead className='text-right'>
                      Growth Difference %
                    </TableHead>
                    <TableHead className='text-center'>
                      Transaction Change
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.yearOverYearGrowth.map((growth, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {growth.comparison}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={
                            growth.growthDifference >= 0
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {formatCurrency(growth.growthDifference)}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          {growth.growthDifferencePercentage >= 0 ? (
                            <TrendingUp className='h-4 w-4 text-green-600' />
                          ) : (
                            <TrendingDown className='h-4 w-4 text-red-600' />
                          )}
                          <span
                            className={
                              growth.growthDifferencePercentage >= 0
                                ? 'text-green-600 font-semibold'
                                : 'text-red-600 font-semibold'
                            }
                          >
                            {formatPercentage(
                              growth.growthDifferencePercentage
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge
                          variant={
                            growth.transactionCountDifference >= 0
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {growth.transactionCountDifference >= 0 ? '+' : ''}
                          {growth.transactionCountDifference}
                        </Badge>
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

export default YearOverYearComparison;
