import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { DistributionItem } from '@/types';

interface InvestmentDistributionPieChartProps {
  data: DistributionItem[];
  title?: string;
  height?: number;
  showLegend?: boolean;
}

export const InvestmentDistributionPieChart = ({
  data,
  title = 'Investment Distribution',
  height = 400,
  showLegend = true,
}: InvestmentDistributionPieChartProps) => {
  const chartOptions = useMemo(() => {
    // Transform data for pie chart
    const pieData = data.map((item) => ({
      name: item.category,
      y: item.value,
      percentage: item.percentage,
      count: item.count,
      color: item.color || undefined,
    }));

    return {
      chart: {
        type: 'pie',
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
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        style: {
          color: '#111827',
        },
        formatter: function (this: any): string {
          const point = this.point;
          let tooltip = '<b>' + point.name + '</b><br/>';
          tooltip +=
            'Value: <b>$' +
            Highcharts.numberFormat(point.y, 2, '.', ',') +
            '</b><br/>';
          tooltip +=
            'Percentage: <b>' + point.percentage.toFixed(1) + '%</b><br/>';
          tooltip += 'Count: <b>' + point.count + '</b>';
          return tooltip;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            style: {
              color: '#374151',
              fontSize: '12px',
              fontWeight: 'normal',
            },
            distance: 15,
          },
          showInLegend: showLegend,
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {
          color: '#374151',
          fontWeight: 'normal',
        },
        itemMarginBottom: 10,
      },
      series: [
        {
          name: 'Distribution',
          colorByPoint: true,
          data: pieData,
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
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f}%',
                    distance: 5,
                  },
                },
              },
            },
          },
        ],
      },
    };
  }, [data, title, height, showLegend]);

  // Show message if no data
  if (!data || data.length === 0) {
    return (
      <div className='flex items-center justify-center h-[400px] bg-light-100 rounded-lg border border-light-400'>
        <div className='text-center'>
          <p className='p-16-regular text-dark-600'>
            No distribution data available
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
