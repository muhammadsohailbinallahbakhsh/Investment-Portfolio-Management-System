import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { PerformanceChartData } from '@/types';

interface PortfolioPerformanceChartProps {
  data: PerformanceChartData;
  title?: string;
  height?: number;
}

export const PortfolioPerformanceChart = ({
  data,
  title = 'Portfolio Performance',
  height = 300,
}: PortfolioPerformanceChartProps) => {
  const options: Highcharts.Options = {
    chart: {
      type: 'areaspline',
      height: height,
      backgroundColor: 'transparent',
    },
    title: {
      text: title || undefined,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    xAxis: {
      categories: data?.labels || [],
      gridLineWidth: 0,
      lineColor: '#e5e7eb',
    },
    yAxis: {
      title: {
        text: 'Portfolio Value',
      },
      gridLineColor: '#f3f4f6',
      labels: {
        formatter: function () {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
          }).format(this.value as number);
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      style: {
        color: '#ffffff',
      },
      formatter: function () {
        return `<b>${this.x}</b><br/>Portfolio Value: ${new Intl.NumberFormat(
          'en-US',
          {
            style: 'currency',
            currency: 'USD',
          }
        ).format(this.y as number)}`;
      },
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.1,
        marker: {
          enabled: true,
          radius: 3,
          fillColor: '#3b82f6',
          lineColor: '#ffffff',
          lineWidth: 2,
        },
      },
    },
    series: [
      {
        type: 'areaspline',
        name: 'Portfolio Value',
        data: data?.values || [],
        color: '#3b82f6',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(59, 130, 246, 0.2)'],
            [1, 'rgba(59, 130, 246, 0.05)'],
          ],
        },
      },
    ],
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
