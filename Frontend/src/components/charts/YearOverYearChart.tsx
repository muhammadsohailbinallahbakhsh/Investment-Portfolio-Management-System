import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { YearSummaryItem } from '@/types';

interface YearOverYearChartProps {
  data: YearSummaryItem[];
  title?: string;
  height?: number;
}

/**
 * Year-over-Year Comparison Chart Component
 * Displays a combo chart (column + line) showing ending values and growth percentages across years
 */
export const YearOverYearChart = ({
  data,
  title = 'Year-over-Year Portfolio Performance',
  height = 400,
}: YearOverYearChartProps) => {
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className='flex items-center justify-center h-[400px] text-gray-500'>
        <p>No year-over-year data available</p>
      </div>
    );
  }

  // Prepare chart data
  const years = data.map((item) => item.year.toString());
  const endingValues = data.map((item) => item.endingValue);
  const growthPercentages = data.map((item) => item.growthPercentage);

  // Chart configuration
  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: height,
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit',
      },
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e293b',
      },
    },
    xAxis: {
      categories: years,
      crosshair: true,
      labels: {
        style: {
          fontSize: '12px',
          color: '#64748b',
        },
      },
    },
    yAxis: [
      {
        // Primary Y-axis (Ending Value)
        title: {
          text: 'Ending Value ($)',
          style: {
            fontSize: '12px',
            color: '#64748b',
          },
        },
        labels: {
          formatter: function (this: any): string {
            return formatCurrency(this.value);
          },
          style: {
            fontSize: '11px',
            color: '#64748b',
          },
        },
        gridLineColor: '#e2e8f0',
      },
      {
        // Secondary Y-axis (Growth %)
        title: {
          text: 'Growth (%)',
          style: {
            fontSize: '12px',
            color: '#64748b',
          },
        },
        labels: {
          formatter: function (this: any): string {
            return `${this.value}%`;
          },
          style: {
            fontSize: '11px',
            color: '#64748b',
          },
        },
        opposite: true,
        gridLineWidth: 0,
      },
    ],
    tooltip: {
      shared: true,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderRadius: 8,
      shadow: false,
      useHTML: true,
      formatter: function (this: any): string {
        const yearIndex = this.points[0].point.index;
        const yearData = data[yearIndex];

        return `
          <div style="padding: 8px; min-width: 200px;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #1e293b;">
              ${yearData.year}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #6366f1;">●</span>
              <span style="margin-left: 4px; color: #64748b;">Starting Value:</span>
              <strong style="float: right; color: #1e293b;">${formatCurrency(
                yearData.startingValue
              )}</strong>
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #6366f1;">●</span>
              <span style="margin-left: 4px; color: #64748b;">Ending Value:</span>
              <strong style="float: right; color: #1e293b;">${formatCurrency(
                yearData.endingValue
              )}</strong>
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #10b981;">●</span>
              <span style="margin-left: 4px; color: #64748b;">Growth:</span>
              <strong style="float: right; color: ${
                yearData.growth >= 0 ? '#10b981' : '#ef4444'
              };">${formatCurrency(yearData.growth)}</strong>
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #10b981;">●</span>
              <span style="margin-left: 4px; color: #64748b;">Growth %:</span>
              <strong style="float: right; color: ${
                yearData.growthPercentage >= 0 ? '#10b981' : '#ef4444'
              };">${formatPercentage(yearData.growthPercentage)}</strong>
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
              ${yearData.totalTransactions} transactions • ${
          yearData.newInvestments
        } new investments
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        dataLabels: {
          enabled: false,
        },
      },
      line: {
        dataLabels: {
          enabled: false,
        },
        marker: {
          enabled: true,
          radius: 4,
        },
      },
    },
    series: [
      {
        name: 'Ending Value',
        type: 'column',
        data: endingValues,
        color: '#6366f1',
        yAxis: 0,
      },
      {
        name: 'Growth %',
        type: 'line',
        data: growthPercentages,
        color: '#10b981',
        yAxis: 1,
        marker: {
          symbol: 'circle',
          fillColor: '#10b981',
        },
        zones: [
          {
            value: 0,
            color: '#ef4444',
          },
          {
            color: '#10b981',
          },
        ],
      },
    ],
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        fontSize: '12px',
        fontWeight: '400',
        color: '#64748b',
      },
      itemHoverStyle: {
        color: '#1e293b',
      },
    },
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
              enabled: true,
              align: 'center',
            },
            yAxis: [
              {
                title: {
                  text: undefined,
                },
              },
              {
                title: {
                  text: undefined,
                },
              },
            ],
          },
        },
      ],
    },
  };

  return (
    <div className='w-full'>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
