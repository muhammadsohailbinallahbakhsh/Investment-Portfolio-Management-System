import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  PieChart,
  FileText,
  ArrowRight,
  TrendingUp,
  Activity,
  History,
} from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();

  const reportTypes = [
    {
      id: 'performance-summary',
      title: 'Performance Summary',
      description:
        'Comprehensive overview of your portfolio performance including top performers, trends, and analytics',
      icon: BarChart3,
      color: 'bg-primary-100 text-primary-500',
      path: '/reports/performance-summary',
    },
    {
      id: 'investment-distribution',
      title: 'Investment Distribution',
      description:
        'Analyze your portfolio composition by type, status, and allocation percentages',
      icon: PieChart,
      color: 'bg-blue-100 text-blue-500',
      path: '/reports/investment-distribution',
    },
    {
      id: 'transaction-history',
      title: 'Transaction History',
      description:
        'Detailed breakdown of all transactions with volume analysis and trends over time',
      icon: History,
      color: 'bg-purple-100 text-purple-500',
      path: '/reports/transaction-history',
    },
    {
      id: 'year-over-year',
      title: 'Year-over-Year Comparison',
      description:
        'Compare portfolio performance across different years to identify growth trends and patterns',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-500',
      path: '/reports/year-over-year',
    },
    {
      id: 'top-performing',
      title: 'Top Performing Investments',
      description:
        'Detailed analysis of your best performing investments ranked by percentage, absolute gain, and value',
      icon: Activity,
      color: 'bg-amber-100 text-amber-600',
      path: '/reports/top-performing',
    },
  ];

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div>
        <h1 className='p-32-bold text-dark-900'>Reports & Analytics</h1>
        <p className='p-16-regular text-dark-600 mt-2'>
          Generate detailed reports and analyze your investment portfolio
          performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Available Reports</p>
                <p className='p-24-bold text-dark-900 mt-1'>5</p>
              </div>
              <div className='rounded-full bg-primary-100 p-3'>
                <FileText className='h-6 w-6 text-primary-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Report Types</p>
                <p className='p-24-bold text-dark-900 mt-1'>
                  Performance & Distribution
                </p>
              </div>
              <div className='rounded-full bg-success-100 p-3'>
                <TrendingUp className='h-6 w-6 text-success-700' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-light-400 shadow-100'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='p-14-regular text-dark-600'>Real-time Data</p>
                <p className='p-24-bold text-dark-900 mt-1'>Live Updates</p>
              </div>
              <div className='rounded-full bg-blue-100 p-3'>
                <Activity className='h-6 w-6 text-blue-500' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.id}
              className='border-light-400 shadow-100 hover:shadow-200 transition-shadow cursor-pointer'
              onClick={() => navigate(report.path)}
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className={`rounded-full ${report.color} p-3`}>
                    <Icon className='h-6 w-6' />
                  </div>
                  <ArrowRight className='h-5 w-5 text-dark-400' />
                </div>
                <CardTitle className='p-20-bold text-dark-900 mt-4'>
                  {report.title}
                </CardTitle>
                <CardDescription className='p-14-regular text-dark-600 mt-2'>
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(report.path);
                  }}
                  className='w-full bg-primary-500 hover:bg-primary-600'
                >
                  View Report
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <Card className='border-light-400 shadow-100'>
        <CardHeader>
          <CardTitle className='p-20-bold text-dark-900'>
            About Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3 text-dark-700'>
            <p className='p-14-regular'>
              <strong>Performance Summary:</strong> Get a complete overview of
              your investment performance, including top and worst performers,
              monthly trends, and performance breakdown by investment type.
            </p>
            <p className='p-14-regular'>
              <strong>Investment Distribution:</strong> Visualize how your
              portfolio is allocated across different investment types,
              statuses, and portfolios with detailed percentage breakdowns.
            </p>
            <p className='p-14-regular'>
              <strong>Transaction History:</strong> Review all your investment
              transactions with detailed analytics on buy/sell volumes and
              transaction patterns over time.
            </p>
            <p className='p-14-regular'>
              <strong>Year-over-Year Comparison:</strong> Compare portfolio
              performance across different years with detailed growth analysis,
              best/worst year identification, and transaction trends.
            </p>
            <p className='p-14-regular'>
              <strong>Top Performing Investments:</strong> Identify your best
              investments ranked by percentage return, absolute gain, and
              current value with detailed performance metrics and type analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
