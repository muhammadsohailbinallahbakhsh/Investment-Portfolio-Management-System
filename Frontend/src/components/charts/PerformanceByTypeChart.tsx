import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { PerformanceByTypeItem } from '@/types';

interface PerformanceByTypeChartProps {
  data: PerformanceByTypeItem[];
  title?: string;
  height?: number;
}

export const PerformanceByTypeChart = ({
  data,
  title = 'Performance by Investment Type',
  height = 400,
}: PerformanceByTypeChartProps) => {
  const chartOptions = useMemo(() => {
    // Extract data for chart
    const types = data.map((item) => item.type);
    const totalInvested = data.map((item) => item.totalInvested);
    const currentValue = data.map((item) => item.currentValue);
    const gainLoss = data.map((item) => item.gainLoss);

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
        categories: types,
        labels: {
          style: {
            color: '#6b7280',
            fontSize: '12px',
          },
        },
        title: {
          text: 'Investment Type',
          style: {
            color: '#374151',
            fontWeight: 'bold',
          },
        },
      },
      yAxis: {
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
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        style: {
          color: '#111827',
        },
        formatter: function (this: any): string {
          const value = this.y as number;
          const color = this.color;
          const seriesName = this.series.name;
          const category = this.x;

          let tooltip = '<b>' + category + '</b><br/>';
          tooltip += '<span style="color:' + color + '">●</span> ';
          tooltip +=
            seriesName +
            ': <b>$' +
            Highcharts.numberFormat(value, 2, '.', ',') +
            '</b>';

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
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: 'Total Invested',
          data: totalInvested,
          color: '#8b5cf6', // Purple
        },
        {
          name: 'Current Value',
          data: currentValue,
          color: '#3b82f6', // Blue
        },
        {
          name: 'Gain/Loss',
          data: gainLoss,
          color: '#10b981', // Green
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
            No performance by type data available
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
