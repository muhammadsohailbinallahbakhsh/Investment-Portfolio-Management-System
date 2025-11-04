import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
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
  height = 400,
  showLegend = true,
}: AssetAllocationChartProps) => {
  const chartOptions = useMemo(() => {
    const { labels, values } = data;

    // Check if data is available
    if (!labels || labels.length === 0 || !values || values.length === 0) {
      return {
        chart: {
          height: height,
        },
        title: {
          text: 'No Asset Allocation Data',
          style: {
            color: '#9ca3af',
            fontSize: '16px',
          },
        },
        subtitle: {
          text: 'Start investing to see your asset allocation',
          style: {
            color: '#9ca3af',
            fontSize: '14px',
          },
        },
      };
    }

    // Define color palette for different investment types
    const colorPalette = [
      '#3b82f6', // Blue - Stocks
      '#10b981', // Green - Bonds
      '#f59e0b', // Amber - Real Estate
      '#8b5cf6', // Purple - Mutual Funds
      '#ec4899', // Pink - ETFs
      '#06b6d4', // Cyan - Commodities
      '#ef4444', // Red - Crypto
      '#6366f1', // Indigo - Others
    ];

    // Transform data for donut chart
    const pieData = labels.map((label, index) => {
      const value = values[index];
      const total = values.reduce((sum, v) => sum + v, 0);
      const percentage = total > 0 ? (value / total) * 100 : 0;

      return {
        name: label,
        y: value,
        percentage: percentage,
        color: colorPalette[index % colorPalette.length],
      };
    });

    return {
      chart: {
        type: 'pie',
        height: height,
        backgroundColor: '#ffffff',
        style: {
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        borderRadius: 8,
      },
      title: {
        text: title,
        align: 'left',
        style: {
          color: '#1f2937',
          fontWeight: '600',
          fontSize: '18px',
        },
      },
      subtitle: {
        text: 'Investment distribution by type',
        align: 'left',
        style: {
          color: '#6b7280',
          fontSize: '14px',
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        shadow: {
          color: 'rgba(0, 0, 0, 0.1)',
          offsetX: 0,
          offsetY: 2,
          width: 4,
        },
        style: {
          color: '#1f2937',
          fontSize: '13px',
        },
        formatter: function (this: any): string {
          const point = this.point;
          return `
            <div style="padding: 4px;">
              <strong style="color: ${point.color};">${point.name}</strong><br/>
              <span style="color: #6b7280;">Value:</span>
              <strong style="color: #1f2937;">$${Highcharts.numberFormat(
                point.y,
                2,
                '.',
                ','
              )}</strong><br/>
              <span style="color: #6b7280;">Percentage:</span>
              <strong style="color: #2563eb;">${point.percentage.toFixed(
                1
              )}%</strong>
            </div>
          `;
        },
        useHTML: true,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '60%', // Makes it a donut chart
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            style: {
              color: '#374151',
              fontSize: '12px',
              fontWeight: '500',
              textOutline: 'none',
            },
            distance: 10,
            connectorColor: '#9ca3af',
          },
          showInLegend: showLegend,
          borderWidth: 3,
          borderColor: '#ffffff',
          states: {
            hover: {
              brightness: 0.1,
            },
            inactive: {
              opacity: 0.5,
            },
          },
        },
      },
      legend: {
        enabled: showLegend,
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {
          color: '#374151',
          fontWeight: '500',
          fontSize: '13px',
        },
        itemMarginBottom: 8,
        symbolRadius: 6,
        symbolHeight: 12,
        symbolWidth: 12,
      },
      series: [
        {
          name: 'Asset Allocation',
          colorByPoint: true,
          data: pieData,
          type: 'pie',
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
              chart: {
                height: 350,
              },
              subtitle: {
                text: null,
              },
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
                itemStyle: {
                  fontSize: '11px',
                },
              },
              plotOptions: {
                pie: {
                  innerSize: '50%',
                  dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.0f}%',
                    distance: 5,
                    style: {
                      fontSize: '11px',
                    },
                  },
                },
              },
            },
          },
        ],
      },
    };
  }, [data, title, height, showLegend]);

  return (
    <div className='w-full'>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};
