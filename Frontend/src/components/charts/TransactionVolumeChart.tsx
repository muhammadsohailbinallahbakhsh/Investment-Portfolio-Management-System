import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { TransactionsByMonthItem } from '@/types';

interface TransactionVolumeChartProps {
  data: TransactionsByMonthItem[];
  title?: string;
  height?: number;
}

export const TransactionVolumeChart = ({
  data,
  title = 'Monthly Transaction Volume',
  height = 400,
}: TransactionVolumeChartProps) => {
  const chartOptions = useMemo(() => {
    // Extract data for chart
    const months = data.map((item) => item.month);
    const counts = data.map((item) => item.count);
    const volumes = data.map((item) => item.volume);

    return {
      chart: {
        type: 'column',
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
          // Primary Y-axis (for count)
          title: {
            text: 'Transaction Count',
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
              return Highcharts.numberFormat(this.value as number, 0, '.', ',');
            },
          },
        },
        {
          // Secondary Y-axis (for volume)
          title: {
            text: 'Volume ($)',
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

            if (seriesName === 'Volume') {
              tooltip += '$' + Highcharts.numberFormat(value, 2, '.', ',');
            } else {
              tooltip += Highcharts.numberFormat(value, 0, '.', ',');
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
        column: {
          borderRadius: 4,
        },
      },
      series: [
        {
          name: 'Count',
          data: counts,
          color: '#3b82f6', // Blue
          yAxis: 0,
        },
        {
          name: 'Volume',
          data: volumes,
          color: '#10b981', // Green
          yAxis: 1,
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
                    text: 'Count',
                  },
                },
                {
                  labels: {
                    align: 'left',
                    x: 3,
                  },
                  title: {
                    text: 'Volume',
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
            No transaction volume data available
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
