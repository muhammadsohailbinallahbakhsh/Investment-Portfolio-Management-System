import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { MonthlyTrendItem } from '@/types';

interface MonthlyPerformanceChartProps {
  data: MonthlyTrendItem[];
  title?: string;
  height?: number;
}

export const MonthlyPerformanceChart = ({
  data,
  title = 'Monthly Performance Trend',
  height = 400,
}: MonthlyPerformanceChartProps) => {
  const chartOptions = useMemo(() => {
    // Extract data for chart
    const months = data.map((item) => item.month);
    const values = data.map((item) => item.value);
    const investedAmounts = data.map((item) => item.investedAmount);
    const gainLoss = data.map((item) => item.gainLoss);

    return {
      chart: {
        type: 'line',
        height: height,
        backgroundColor: '#ffffff',
        style: {
          fontFamily: 'Arial, sans-serif',
        },
      },
      title: {
        text: title,
        style: {
          color: '#1e40af',
          fontWeight: 'bold',
          fontSize: '18px',
        },
      },
      xAxis: {
        categories: months,
        labels: {
          style: {
            color: '#6b7280',
            fontSize: '12px',
          },
        },
        title: {
          text: 'Month',
          style: {
            color: '#374151',
            fontWeight: 'bold',
          },
        },
      },
      yAxis: [
        {
          // Primary Y-axis (for values and invested amounts)
          title: {
            text: 'Amount ($)',
            style: {
              color: '#374151',
              fontWeight: 'bold',
            },
          },
          labels: {
            style: {
              color: '#6b7280',
            },
            formatter: function (this: any): string {
              return (
                '$' + Highcharts.numberFormat(this.value as number, 0, '.', ',')
              );
            },
          },
        },
        {
          // Secondary Y-axis (for gain/loss)
          title: {
            text: 'Gain/Loss ($)',
            style: {
              color: '#374151',
              fontWeight: 'bold',
            },
          },
          labels: {
            style: {
              color: '#6b7280',
            },
            formatter: function (this: any): string {
              const value = this.value as number;
              return (
                (value >= 0 ? '+' : '') +
                '$' +
                Highcharts.numberFormat(value, 0, '.', ',')
              );
            },
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        style: {
          color: '#111827',
        },
        formatter: function (this: any): string {
          let tooltip = '<b>' + this.x + '</b><br/>';
          this.points?.forEach((point: any) => {
            const value = point.y as number;
            const color = point.color;
            const seriesName = point.series.name;

            tooltip += '<span style="color:' + color + '">●</span> ';
            tooltip += seriesName + ': <b>';

            if (seriesName === 'Gain/Loss') {
              tooltip +=
                (value >= 0 ? '+' : '') +
                '$' +
                Highcharts.numberFormat(value, 2, '.', ',');
            } else {
              tooltip += '$' + Highcharts.numberFormat(value, 2, '.', ',');
            }

            tooltip += '</b><br/>';
          });
          return tooltip;
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#374151',
          fontWeight: 'normal',
        },
      },
      plotOptions: {
        line: {
          lineWidth: 3,
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'circle',
          },
          states: {
            hover: {
              lineWidth: 4,
            },
          },
        },
      },
      series: [
        {
          name: 'Current Value',
          data: values,
          color: '#3b82f6', // Blue
          yAxis: 0,
          marker: {
            symbol: 'circle',
          },
        },
        {
          name: 'Invested Amount',
          data: investedAmounts,
          color: '#8b5cf6', // Purple
          yAxis: 0,
          marker: {
            symbol: 'square',
          },
        },
        {
          name: 'Gain/Loss',
          data: gainLoss,
          color: '#10b981', // Green (will show negative values in context)
          yAxis: 1,
          marker: {
            symbol: 'diamond',
          },
          zones: [
            {
              value: 0,
              color: '#ef4444', // Red for negative values
            },
            {
              color: '#10b981', // Green for positive values
            },
          ],
        },
      ],
      credits: {
        enabled: false,
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 768,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
              yAxis: [
                {
                  labels: {
                    align: 'right',
                    x: -3,
                  },
                  title: {
                    text: 'Amount',
                  },
                },
                {
                  labels: {
                    align: 'left',
                    x: 3,
                  },
                  title: {
                    text: 'Gain/Loss',
                  },
                },
              ],
            },
          },
        ],
      },
    };
  }, [data, title, height]);

  // Show message if no data
  if (!data || data.length === 0) {
    return (
      <div className='flex items-center justify-center h-[400px] bg-light-100 rounded-lg border border-light-400'>
        <div className='text-center'>
          <p className='p-16-regular text-dark-600'>
            No monthly performance data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};
