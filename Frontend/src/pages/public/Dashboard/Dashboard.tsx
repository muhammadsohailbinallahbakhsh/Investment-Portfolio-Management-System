import React from 'react';

import { useDashboard } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  AlertTriangle,
  Loader2,
  Calendar,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Package,
  ArrowRight,
  Receipt,
  LineChart,
  PieChart,
} from 'lucide-react';
import {
  formatCurrency,
  formatPercentage,
  getGainLossColorClass,
  formatDate,
  formatDateTime,
} from '@/utils';
import type { InvestmentPerformanceCard, RecentTransactionDto } from '@/types';
import { useNavigate } from 'react-router-dom';
import {
  PortfolioPerformanceChart,
  AssetAllocationChart,
} from '@/components/charts';

const Dashboard = () => {
  const { data, isLoading, isError, error } = useDashboard();
  const navigate = useNavigate();

  // Get transaction icon and color based on type
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

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary-100' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <AlertTriangle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>
            Error Loading Dashboard
          </h2>
          <p className='text-gray-600'>
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (!data?.data?.summaryCards) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Activity className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>
            No Dashboard Data
          </h2>
          <p className='text-gray-600'>
            Start investing to see your portfolio dashboard.
          </p>
        </div>
      </div>
    );
  }

  const summary = data.data.summaryCards;

  return (
    <div className='w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='p-32-bold text-dark-100'>Portfolio Dashboard</h1>
          <p className='p-14-regular text-gray-500 mt-1'>
            Your investment portfolio overview
          </p>
        </div>
        {data.data.generatedAt && (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Calendar className='w-4 h-4' />
            <span>Updated: {formatDate(data.data.generatedAt)}</span>
          </div>
        )}
      </div>

      {/* Summary Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Card 1: Total Investment Value */}
        <Card className='shadow-100 border-light-400 hover:shadow-200 transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='p-14-semibold text-gray-600'>
              Total Investment Value
            </CardTitle>
            <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center'>
              <DollarSign className='w-5 h-5 text-blue-600' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='p-24-bold text-dark-100'>
              {formatCurrency(summary.totalInvestmentValue)}
            </div>
            <p className='p-12-regular text-gray-500 mt-1'>
              From {formatCurrency(summary.totalInvested)} invested
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total Gain/Loss */}
        <Card className='shadow-100 border-light-400 hover:shadow-200 transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='p-14-semibold text-gray-600'>
              Total Gain/Loss
            </CardTitle>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                summary.totalGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              {summary.totalGainLoss >= 0 ? (
                <TrendingUp className='w-5 h-5 text-green-600' />
              ) : (
                <TrendingDown className='w-5 h-5 text-red-600' />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`p-24-bold ${getGainLossColorClass(
                summary.totalGainLoss
              )}`}
            >
              {summary.totalGainLoss >= 0 ? '+' : ''}
              {formatCurrency(summary.totalGainLoss)}
            </div>
            <p
              className={`p-12-regular mt-1 ${getGainLossColorClass(
                summary.totalGainLossPercentage
              )}`}
            >
              {formatPercentage(summary.totalGainLossPercentage)} return
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Active Investments */}
        <Card className='shadow-100 border-light-400 hover:shadow-200 transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='p-14-semibold text-gray-600'>
              Active Investments
            </CardTitle>
            <div className='w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center'>
              <Activity className='w-5 h-5 text-purple-600' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex items-baseline gap-2'>
              <span className='p-24-bold text-dark-100'>
                {summary.numberOfActiveInvestments}
              </span>
              <Badge variant='secondary' className='text-xs'>
                of {summary.totalInvestments}
              </Badge>
            </div>
            <p className='p-12-regular text-gray-500 mt-1'>
              Across {summary.portfolioCount} portfolio
              {summary.portfolioCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Best Performing Investment */}
        <Card className='shadow-100 border-light-400 hover:shadow-200 transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='p-14-semibold text-gray-600'>
              Best Performer
            </CardTitle>
            <div className='w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center'>
              <Award className='w-5 h-5 text-amber-600' />
            </div>
          </CardHeader>
          <CardContent>
            {summary.bestPerforming ? (
              <PerformanceCard investment={summary.bestPerforming} />
            ) : (
              <p className='p-14-regular text-gray-500'>
                No performance data yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Worst Performing Investment Card - Full Width Below */}
      {summary.worstPerforming && (
        <Card className='shadow-100 border-light-400 hover:shadow-200 transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
            <CardTitle className='p-16-semibold text-gray-700'>
              Worst Performer
            </CardTitle>
            <div className='w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center'>
              <AlertTriangle className='w-5 h-5 text-orange-600' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <p className='p-12-regular text-gray-500 mb-1'>Investment</p>
                <p className='p-14-semibold text-dark-100'>
                  {summary.worstPerforming.name}
                </p>
                <Badge variant='outline' className='mt-1 text-xs'>
                  {summary.worstPerforming.type}
                </Badge>
              </div>
              <div>
                <p className='p-12-regular text-gray-500 mb-1'>Current Value</p>
                <p className='p-14-semibold text-dark-100'>
                  {formatCurrency(summary.worstPerforming.currentValue)}
                </p>
                <p className='p-12-regular text-gray-500 mt-1'>
                  from {formatCurrency(summary.worstPerforming.initialAmount)}
                </p>
              </div>
              <div>
                <p className='p-12-regular text-gray-500 mb-1'>Performance</p>
                <p
                  className={`p-14-semibold ${getGainLossColorClass(
                    summary.worstPerforming.gainLoss
                  )}`}
                >
                  {summary.worstPerforming.gainLoss >= 0 ? '+' : ''}
                  {formatCurrency(summary.worstPerforming.gainLoss)}
                </p>
                <p
                  className={`p-12-regular mt-1 ${getGainLossColorClass(
                    summary.worstPerforming.gainLossPercentage
                  )}`}
                >
                  {formatPercentage(summary.worstPerforming.gainLossPercentage)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      {summary.totalTransactions > 0 && (
        <Card className='shadow-100 border-light-400'>
          <CardContent className='pt-6'>
            <div className='flex flex-wrap items-center gap-6 text-sm text-gray-600'>
              <div className='flex items-center gap-2'>
                <Activity className='w-4 h-4' />
                <span>
                  <strong className='text-dark-100'>
                    {summary.totalTransactions}
                  </strong>{' '}
                  total transactions
                </span>
              </div>
              {summary.lastTransactionDate && (
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <span>
                    Last transaction: {formatDate(summary.lastTransactionDate)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions Section */}
      {data.data.recentTransactions &&
        data.data.recentTransactions.length > 0 && (
          <Card className='shadow-100 border-light-400'>
            <CardHeader className='border-b border-light-400'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Receipt className='w-5 h-5 text-primary-100' />
                  <CardTitle className='p-20-semibold text-dark-100'>
                    Recent Transactions
                  </CardTitle>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => navigate('/transactions')}
                  className='text-primary-100 hover:text-primary-500 hover:bg-primary-50'
                >
                  View All
                  <ArrowRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              {/* Desktop Table View */}
              <div className='hidden lg:block overflow-x-auto'>
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
                        Amount
                      </th>
                      <th className='px-6 py-3 text-left p-14-semibold text-dark-700'>
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-light-400'>
                    {data.data.recentTransactions.map((transaction) => {
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
                              {formatDate(transaction.date)}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <p className='p-14-semibold text-dark-900'>
                              {transaction.investmentName}
                            </p>
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
                          <td className='px-6 py-4 text-right p-16-semibold text-dark-900'>
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className='px-6 py-4 p-14-regular text-dark-600'>
                            {transaction.description || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className='lg:hidden divide-y divide-light-400'>
                {data.data.recentTransactions.map((transaction) => {
                  const style = getTransactionStyle(transaction.type);
                  const Icon = style.icon;

                  return (
                    <div
                      key={transaction.id}
                      className='p-4 hover:bg-light-100 transition-colors'
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex-1'>
                          <p className='p-14-semibold text-dark-900 mb-1'>
                            {transaction.investmentName}
                          </p>
                          <div className='flex items-center gap-2 text-sm text-dark-500'>
                            <Calendar className='h-3 w-3' />
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${style.bgColor}`}
                        >
                          <Icon className={`h-3 w-3 ${style.color}`} />
                          <span className={`p-12-semibold ${style.color}`}>
                            {transaction.type}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='p-12-regular text-dark-600'>
                          Amount
                        </span>
                        <span className='p-16-semibold text-dark-900'>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                      {transaction.description && (
                        <div className='mt-2 p-12-regular text-dark-600'>
                          {transaction.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Performance Chart Section */}
      {data.data.performanceChart &&
        data.data.performanceChart.labels &&
        data.data.performanceChart.values &&
        (data.data.performanceChart.labels.length > 0 ||
          data.data.performanceChart.values.length > 0) && (
          <Card className='shadow-100 border-light-400'>
            <CardHeader className='border-b border-light-400'>
              <div className='flex items-center gap-2'>
                <LineChart className='w-5 h-5 text-primary-100' />
                <CardTitle className='p-20-semibold text-dark-100'>
                  Portfolio Performance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <PortfolioPerformanceChart
                data={data.data.performanceChart}
                title=''
                height={350}
              />
            </CardContent>
          </Card>
        )}

      {/* Asset Allocation Chart Section */}
      {data.data.assetAllocation &&
        data.data.assetAllocation.labels &&
        data.data.assetAllocation.values &&
        (data.data.assetAllocation.labels.length > 0 ||
          data.data.assetAllocation.values.length > 0) && (
          <Card className='shadow-100 border-light-400'>
            <CardHeader className='border-b border-light-400'>
              <div className='flex items-center gap-2'>
                <PieChart className='w-5 h-5 text-primary-100' />
                <CardTitle className='p-20-semibold text-dark-100'>
                  Asset Allocation
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <AssetAllocationChart
                data={data.data.assetAllocation}
                title=''
                height={400}
                showLegend={true}
              />
            </CardContent>
          </Card>
        )}
    </div>
  );
};

/**
 * Component to display investment performance data
 */
const PerformanceCard = ({
  investment,
}: {
  investment: InvestmentPerformanceCard;
}) => {
  return (
    <div>
      <div className='mb-2'>
        <p className='p-14-semibold text-dark-100 truncate'>
          {investment.name}
        </p>
        <Badge variant='outline' className='mt-1 text-xs'>
          {investment.type}
        </Badge>
      </div>
      <div
        className={`p-16-bold ${getGainLossColorClass(investment.gainLoss)}`}
      >
        {investment.gainLoss >= 0 ? '+' : ''}
        {formatCurrency(investment.gainLoss)}
      </div>
      <p
        className={`p-12-regular mt-1 ${getGainLossColorClass(
          investment.gainLossPercentage
        )}`}
      >
        {formatPercentage(investment.gainLossPercentage)}
      </p>
    </div>
  );
};

export default Dashboard;
