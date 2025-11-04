import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { PerformanceChartData } from '@/types';

interface PortfolioPerformanceChartProps {
  data: PerformanceChartData;
  title?: string;
  height?: number;
}

export const PortfolioPerformanceChart = ({
  data,
  title = 'Portfolio Performance (12 Months)',
  height = 350,
}: PortfolioPerformanceChartProps) => {
  const chartOptions = useMemo(() => {
    const { labels, values } = data;

    // Check if data is available
    if (!labels || labels.length === 0 || !values || values.length === 0) {
      return {
        chart: {
          height: height,
        },
        title: {
          text: 'No Performance Data Available',
          style: {
            color: '#9ca3af',
            fontSize: '16px',
          },
        },
        subtitle: {
          text: 'Start investing to see your portfolio performance',
          style: {
            color: '#9ca3af',
            fontSize: '14px',
          },
        },
      };
    }

    return {
      chart: {
        type: 'area',
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
        text: 'Total portfolio value over time',
        align: 'left',
        style: {
          color: '#6b7280',
          fontSize: '14px',
        },
      },
      xAxis: {
        categories: labels,
        labels: {
          style: {
            color: '#6b7280',
            fontSize: '12px',
          },
          rotation: -45,
        },
        lineColor: '#e5e7eb',
        tickColor: '#e5e7eb',
      },
      yAxis: {
        title: {
          text: 'Portfolio Value',
          style: {
            color: '#374151',
            fontWeight: '600',
            fontSize: '13px',
          },
        },
        labels: {
          style: {
            color: '#6b7280',
            fontSize: '12px',
          },
          formatter: function (this: any): string {
            return (
              '$' + Highcharts.numberFormat(this.value as number, 0, '.', ',')
            );
          },
        },
        gridLineColor: '#f3f4f6',
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
          const value = this.y as number;
          return `
            <div style="padding: 4px;">
              <strong style="color: #1f2937;">${this.x}</strong><br/>
              <span style="color: #6b7280;">Portfolio Value:</span>
              <strong style="color: #2563eb;">$${Highcharts.numberFormat(
                value,
                2,
                '.',
                ','
              )}</strong>
            </div>
          `;
        },
        useHTML: true,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, 'rgba(37, 99, 235, 0.2)'], // Blue with 20% opacity at top
              [1, 'rgba(37, 99, 235, 0.02)'], // Blue with 2% opacity at bottom
            ],
          },
          marker: {
            radius: 4,
            fillColor: '#2563eb',
            lineWidth: 2,
            lineColor: '#ffffff',
            symbol: 'circle',
          },
          lineWidth: 3,
          lineColor: '#2563eb',
          states: {
            hover: {
              lineWidth: 3,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          name: 'Portfolio Value',
          data: values,
          color: '#2563eb',
          type: 'area',
        },
      ],
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              chart: {
                height: 300,
              },
              subtitle: {
                text: null,
              },
              xAxis: {
                labels: {
                  rotation: -90,
                  style: {
                    fontSize: '10px',
                  },
                },
              },
              yAxis: {
                labels: {
                  style: {
                    fontSize: '10px',
                  },
                },
              },
            },
          },
        ],
      },
    };
  }, [data, title, height]);

  return (
    <div className='w-full'>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};
