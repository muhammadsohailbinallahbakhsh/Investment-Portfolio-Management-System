import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolio } from '@/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  BarChart3,
  Plus,
  Calendar,
} from 'lucide-react';

const PortfolioDetail = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const { data: portfolioData, isLoading } = usePortfolio(
    parseInt(portfolioId || '0')
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary-100' />
      </div>
    );
  }

  const portfolio = portfolioData?.data;

  if (!portfolio) {
    return (
      <div className='w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
        <Card className='shadow-100 border-light-400'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Briefcase className='w-16 h-16 text-gray-200 mb-4' />
            <h3 className='p-20-semibold text-dark-100 mb-2'>
              Portfolio Not Found
            </h3>
            <p className='p-14-regular text-gray-500 mb-6'>
              The portfolio you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button
              onClick={() => navigate('/portfolios')}
              variant='outline'
              className='border-primary-100 text-primary-100'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Portfolios
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gainLoss = portfolio.currentValue - portfolio.totalInvested;
  const gainLossPercentage =
    portfolio.totalInvested > 0
      ? (gainLoss / portfolio.totalInvested) * 100
      : 0;
  const isPositive = gainLoss >= 0;

  return (
    <div className='w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex items-start gap-4'>
          <Button
            onClick={() => navigate('/portfolios')}
            variant='outline'
            size='sm'
            className='border-gray-200 mt-1'
          >
            <ArrowLeft className='w-4 h-4' />
          </Button>
          <div>
            <h1 className='p-32-bold text-dark-100'>{portfolio.name}</h1>
            {portfolio.description && (
              <p className='p-16-regular text-gray-500 mt-1'>
                {portfolio.description}
              </p>
            )}
            <div className='flex items-center gap-2 mt-2 text-gray-500'>
              <Calendar className='w-4 h-4' />
              <span className='p-14-regular'>
                Created: {formatDate(portfolio.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => navigate('/investments/add')}
          className='bg-primary-100 hover:bg-primary-500 text-white'
        >
          <Plus className='w-4 h-4 mr-2' />
          Add Investment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Current Value */}
        <Card className='shadow-100 border-light-400'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center justify-between p-14-medium text-gray-500'>
              Current Value
              <DollarSign className='w-5 h-5 text-primary-100' />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='p-28-bold text-dark-100'>
              {formatCurrency(portfolio.currentValue)}
            </p>
          </CardContent>
        </Card>

        {/* Total Invested */}
        <Card className='shadow-100 border-light-400'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center justify-between p-14-medium text-gray-500'>
              Total Invested
              <Briefcase className='w-5 h-5 text-primary-100' />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='p-28-bold text-dark-100'>
              {formatCurrency(portfolio.totalInvested)}
            </p>
          </CardContent>
        </Card>

        {/* Gain/Loss */}
        <Card className='shadow-100 border-light-400'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center justify-between p-14-medium text-gray-500'>
              Total Gain/Loss
              {isPositive ? (
                <TrendingUp className='w-5 h-5 text-success-500' />
              ) : (
                <TrendingDown className='w-5 h-5 text-red-500' />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`p-28-bold ${
                isPositive ? 'text-success-700' : 'text-red-500'
              }`}
            >
              {isPositive ? '+' : ''}
              {formatCurrency(gainLoss)}
            </p>
            <p
              className={`p-14-regular ${
                isPositive ? 'text-success-700' : 'text-red-500'
              }`}
            >
              {isPositive ? '+' : ''}
              {gainLossPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        {/* Total Investments */}
        <Card className='shadow-100 border-light-400'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center justify-between p-14-medium text-gray-500'>
              Investments
              <BarChart3 className='w-5 h-5 text-primary-100' />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='p-28-bold text-dark-100'>
              {portfolio.totalInvestments}
            </p>
            <p className='p-14-regular text-gray-500'>Active positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {portfolio.performanceMetrics && (
        <Card className='shadow-100 border-light-400'>
          <CardHeader className='bg-light-300'>
            <CardTitle className='p-24-bold text-dark-100 flex items-center gap-2'>
              <BarChart3 className='w-6 h-6 text-primary-100' />
              Performance Metrics
            </CardTitle>
            <CardDescription className='p-14-regular text-gray-500'>
              Detailed performance breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Top Performer */}
              {portfolio.performanceMetrics.topPerformer && (
                <div className='p-4 rounded-lg bg-success-50 border border-success-500'>
                  <div className='flex items-center gap-2 mb-2'>
                    <TrendingUp className='w-5 h-5 text-success-700' />
                    <h4 className='p-16-semibold text-success-700'>
                      Top Performer
                    </h4>
                  </div>
                  <p className='p-18-bold text-dark-100'>
                    {portfolio.performanceMetrics.topPerformer.name}
                  </p>
                  <p className='p-14-regular text-gray-700 mt-1'>
                    {formatCurrency(
                      portfolio.performanceMetrics.topPerformer.currentValue
                    )}
                  </p>
                </div>
              )}

              {/* Worst Performer */}
              {portfolio.performanceMetrics.worstPerformer && (
                <div className='p-4 rounded-lg bg-red-50 border border-red-100'>
                  <div className='flex items-center gap-2 mb-2'>
                    <TrendingDown className='w-5 h-5 text-red-500' />
                    <h4 className='p-16-semibold text-red-500'>
                      Worst Performer
                    </h4>
                  </div>
                  <p className='p-18-bold text-dark-100'>
                    {portfolio.performanceMetrics.worstPerformer.name}
                  </p>
                  <p className='p-14-regular text-gray-700 mt-1'>
                    {formatCurrency(
                      portfolio.performanceMetrics.worstPerformer.currentValue
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investments List */}
      <Card className='shadow-100 border-light-400'>
        <CardHeader className='bg-light-300'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='p-24-bold text-dark-100'>
                Investments
              </CardTitle>
              <CardDescription className='p-14-regular text-gray-500'>
                All investments in this portfolio
              </CardDescription>
            </div>
            <Button
              onClick={() =>
                navigate(`/investments/add?portfolioId=${portfolio.id}`)
              }
              size='sm'
              className='bg-primary-100 hover:bg-primary-500 text-white'
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Investment
            </Button>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          {portfolio.investments && portfolio.investments.length > 0 ? (
            <div className='space-y-4'>
              {portfolio.investments.map((investment) => {
                const invGainLoss =
                  investment.currentValue - investment.initialAmount;
                const invGainLossPercentage =
                  investment.initialAmount > 0
                    ? (invGainLoss / investment.initialAmount) * 100
                    : 0;
                const invIsPositive = invGainLoss >= 0;

                return (
                  <div
                    key={investment.id}
                    className='flex items-center justify-between p-4 rounded-lg border border-light-400 hover:bg-light-300 transition-colors cursor-pointer'
                    onClick={() => navigate(`/investments/${investment.id}`)}
                  >
                    <div className='flex-1'>
                      <h4 className='p-16-semibold text-dark-100'>
                        {investment.name}
                      </h4>
                      <p className='p-14-regular text-gray-500 mt-1'>
                        {investment.type}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='p-18-semibold text-dark-100'>
                        {formatCurrency(investment.currentValue)}
                      </p>
                      <p
                        className={`p-14-regular ${
                          invIsPositive ? 'text-success-700' : 'text-red-500'
                        }`}
                      >
                        {invIsPositive ? '+' : ''}
                        {formatCurrency(Math.abs(invGainLoss))} (
                        {invGainLossPercentage.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-12'>
              <Briefcase className='w-12 h-12 text-gray-200 mx-auto mb-4' />
              <h4 className='p-16-semibold text-dark-100 mb-2'>
                No Investments Yet
              </h4>
              <p className='p-14-regular text-gray-500 mb-4'>
                Start adding investments to this portfolio
              </p>
              <Button
                onClick={() =>
                  navigate(`/investments/add?portfolioId=${portfolio.id}`)
                }
                className='bg-primary-100 hover:bg-primary-500 text-white'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Your First Investment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDetail;
