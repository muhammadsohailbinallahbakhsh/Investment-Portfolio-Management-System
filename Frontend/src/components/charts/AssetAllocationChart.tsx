import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { AssetAllocationData } from '@/types';

interface AssetAllocationChartProps {
  data: AssetAllocationData;
  title?: string;
  height?: number;
  showLegend?: boolean;
}

export const AssetAllocationChart = ({
  data,
  title = 'Asset Allocation',
  height = 300,
  showLegend = true,
}: AssetAllocationChartProps) => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f97316', // orange
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#14b8a6', // teal
    '#ef4444', // red
  ];

  const chartData = (data?.labels || []).map((label, index) => ({
    name: label,
    y: (data?.values || [])[index] || 0,
    color: colors[index % colors.length],
  }));

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
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
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      style: {
        color: '#ffffff',
      },
      pointFormat:
        '<b>{point.name}</b>: {point.percentage:.1f}% <br/>Value: ${point.y:,.2f}',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f}%',
          distance: -30,
          style: {
            color: '#ffffff',
            textOutline: '2px contrast',
            fontSize: '12px',
          },
        },
        showInLegend: showLegend,
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Asset Allocation',
        data: chartData,
      },
    ],
    legend: {
      enabled: showLegend,
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: {
        fontSize: '12px',
      },
    },
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
