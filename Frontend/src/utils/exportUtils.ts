import type {
  PerformanceSummaryReport,
  InvestmentDistributionReport,
  TransactionHistoryReport,
  YearOverYearReport,
  TopPerformingInvestmentsReport,
} from '@/types';

// Export formats
export type ExportFormat = 'pdf' | 'csv' | 'json';

// Generic export function
export const exportReport = (
  data: any,
  reportType: string,
  format: ExportFormat
) => {
  switch (format) {
    case 'csv':
      return exportToCSV(data, reportType);
    case 'json':
      return exportToJSON(data, reportType);
    case 'pdf':
      return exportToPDF(data, reportType);
    default:
      console.error('Unsupported export format');
  }
};

// Export to CSV
const exportToCSV = (data: any, reportType: string) => {
  let csvContent = '';
  const filename = `${reportType}_${
    new Date().toISOString().split('T')[0]
  }.csv`;

  if (reportType === 'performance-summary') {
    csvContent = formatPerformanceSummaryToCSV(data);
  } else if (reportType === 'investment-distribution') {
    csvContent = formatInvestmentDistributionToCSV(data);
  } else if (reportType === 'transaction-history') {
    csvContent = formatTransactionHistoryToCSV(data);
  } else if (reportType === 'year-over-year') {
    csvContent = formatYearOverYearToCSV(data);
  } else if (reportType === 'top-performing-investments') {
    csvContent = formatTopPerformingToCSV(data);
  }

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

// Export to JSON
const exportToJSON = (data: any, reportType: string) => {
  const filename = `${reportType}_${
    new Date().toISOString().split('T')[0]
  }.json`;
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
};

// Export to PDF (Simulation)
const exportToPDF = (data: any, reportType: string) => {
  const filename = `${reportType}_${
    new Date().toISOString().split('T')[0]
  }.pdf`;

  let htmlContent = '';

  if (reportType === 'performance-summary') {
    htmlContent = formatPerformanceSummaryToHTML(data);
  } else if (reportType === 'investment-distribution') {
    htmlContent = formatInvestmentDistributionToHTML(data);
  } else if (reportType === 'transaction-history') {
    htmlContent = formatTransactionHistoryToHTML(data);
  } else if (reportType === 'year-over-year') {
    htmlContent = formatYearOverYearToHTML(data);
  } else if (reportType === 'top-performing-investments') {
    htmlContent = formatTopPerformingToHTML(data);
  }

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

// Format Performance Summary to CSV
const formatPerformanceSummaryToCSV = (
  report: PerformanceSummaryReport
): string => {
  let csv = 'Performance Summary Report\n\n';
  csv += `Generated At,${report.generatedAt}\n\n`;

  // Overall Performance
  csv += 'Overall Performance\n';
  csv += 'Metric,Value\n';
  csv += `Total Invested,${report.totalInvested}\n`;
  csv += `Current Value,${report.currentValue}\n`;
  csv += `Total Gain/Loss,${report.totalGainLoss}\n`;
  csv += `Return Percentage,${report.totalGainLossPercentage}%\n\n`;

  // Investment Breakdown
  csv += 'Investment Breakdown\n';
  csv += `Total Investments,${report.totalInvestments}\n`;
  csv += `Active Investments,${report.activeInvestments}\n`;
  csv += `Sold Investments,${report.soldInvestments}\n`;
  csv += `On Hold Investments,${report.onHoldInvestments}\n\n`;

  // Top Performers
  if (report.topPerformers.length > 0) {
    csv += 'Top Performers\n';
    csv += 'Name,Type,Initial Amount,Current Value,Gain/Loss,Gain/Loss %\n';
    report.topPerformers.forEach((item) => {
      csv += `"${item.name}",${item.type},${item.initialAmount},${item.currentValue},${item.gainLoss},${item.gainLossPercentage}%\n`;
    });
    csv += '\n';
  }

  // Worst Performers
  if (report.worstPerformers.length > 0) {
    csv += 'Worst Performers\n';
    csv += 'Name,Type,Initial Amount,Current Value,Gain/Loss,Gain/Loss %\n';
    report.worstPerformers.forEach((item) => {
      csv += `"${item.name}",${item.type},${item.initialAmount},${item.currentValue},${item.gainLoss},${item.gainLossPercentage}%\n`;
    });
    csv += '\n';
  }

  // Performance by Type
  if (report.performanceByType.length > 0) {
    csv += 'Performance by Type\n';
    csv += 'Type,Count,Total Invested,Current Value,Gain/Loss,Return %\n';
    report.performanceByType.forEach((item) => {
      csv += `${item.type},${item.count},${item.totalInvested},${item.currentValue},${item.gainLoss},${item.gainLossPercentage}%\n`;
    });
    csv += '\n';
  }

  // Monthly Trend
  if (report.monthlyTrend.length > 0) {
    csv += 'Monthly Performance Trend\n';
    csv += 'Month,Value,Invested Amount,Gain/Loss,Return %\n';
    report.monthlyTrend.forEach((item) => {
      csv += `${item.month},${item.value},${item.investedAmount},${item.gainLoss},${item.gainLossPercentage}%\n`;
    });
  }

  return csv;
};

// Format Investment Distribution to CSV
const formatInvestmentDistributionToCSV = (
  report: InvestmentDistributionReport
): string => {
  let csv = 'Investment Distribution Report\n\n';
  csv += `Generated At,${report.generatedAt}\n`;
  csv += `Total Portfolio Value,${report.totalPortfolioValue}\n`;
  csv += `Total Investments,${report.totalInvestments}\n\n`;

  // Distribution by Type
  if (report.distributionByType.length > 0) {
    csv += 'Distribution by Type\n';
    csv += 'Category,Count,Value,Percentage\n';
    report.distributionByType.forEach((item) => {
      csv += `${item.category},${item.count},${item.value},${item.percentage}%\n`;
    });
    csv += '\n';
  }

  // Distribution by Status
  if (report.distributionByStatus.length > 0) {
    csv += 'Distribution by Status\n';
    csv += 'Status,Count,Value,Percentage\n';
    report.distributionByStatus.forEach((item) => {
      csv += `${item.category},${item.count},${item.value},${item.percentage}%\n`;
    });
    csv += '\n';
  }

  // Investment Size Distribution
  if (report.investmentSizeDistribution.length > 0) {
    csv += 'Investment Size Distribution\n';
    csv += 'Range,Count,Total Value\n';
    report.investmentSizeDistribution.forEach((item) => {
      csv += `"${item.range}",${item.count},${item.totalValue}\n`;
    });
    csv += '\n';
  }

  // All Investments
  if (report.investments.length > 0) {
    csv += 'All Investments\n';
    csv +=
      'Name,Type,Status,Initial Amount,Current Value,Gain/Loss,Gain/Loss %,Purchase Date\n';
    report.investments.forEach((item) => {
      csv += `"${item.name}",${item.type},${item.status},${item.initialAmount},${item.currentValue},${item.gainLoss},${item.gainLossPercentage}%,${item.purchaseDate}\n`;
    });
  }

  return csv;
};

// Format Transaction History to CSV
const formatTransactionHistoryToCSV = (
  report: TransactionHistoryReport
): string => {
  let csv = 'Transaction History Report\n\n';
  csv += `Generated At,${report.generatedAt}\n`;
  if (report.periodStart && report.periodEnd) {
    csv += `Period,${report.periodStart} to ${report.periodEnd}\n`;
  }
  csv += '\n';

  // Summary
  csv += 'Transaction Summary\n';
  csv += 'Metric,Value\n';
  csv += `Total Transactions,${report.totalTransactions}\n`;
  csv += `Total Volume,${report.totalVolume}\n`;
  csv += `Buy Transactions,${report.buyTransactions}\n`;
  csv += `Buy Volume,${report.buyVolume}\n`;
  csv += `Sell Transactions,${report.sellTransactions}\n`;
  csv += `Sell Volume,${report.sellVolume}\n`;
  csv += `Update Transactions,${report.updateTransactions}\n\n`;

  // Transactions by Type
  if (report.transactionsByType.length > 0) {
    csv += 'Transactions by Type\n';
    csv += 'Type,Count,Volume,Percentage\n';
    report.transactionsByType.forEach((item) => {
      csv += `${item.type},${item.count},${item.volume},${item.percentage}%\n`;
    });
    csv += '\n';
  }

  // Transactions by Month
  if (report.transactionsByMonth.length > 0) {
    csv += 'Transactions by Month\n';
    csv += 'Month,Count,Volume\n';
    report.transactionsByMonth.forEach((item) => {
      csv += `${item.month},${item.count},${item.volume}\n`;
    });
    csv += '\n';
  }

  // All Transactions
  if (report.transactions.length > 0) {
    csv += 'Transaction Details\n';
    csv +=
      'Date,Investment Name,Investment Type,Transaction Type,Quantity,Price Per Unit,Amount,Notes\n';
    report.transactions.forEach((item) => {
      const notes = item.notes ? item.notes.replace(/"/g, '""') : '';
      csv += `${item.date},"${item.investmentName}",${item.investmentType},${item.transactionType},${item.quantity},${item.pricePerUnit},${item.amount},"${notes}"\n`;
    });
  }

  return csv;
};

// Format Performance Summary to HTML for PDF
const formatPerformanceSummaryToHTML = (
  report: PerformanceSummaryReport
): string => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${report.reportTitle}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        h1 {
          color: #1e40af;
          border-bottom: 3px solid #1e40af;
          padding-bottom: 10px;
        }
        h2 {
          color: #1e40af;
          margin-top: 30px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .info {
          color: #6b7280;
          margin-bottom: 20px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        .summary-card {
          border: 1px solid #e5e7eb;
          padding: 15px;
          border-radius: 8px;
        }
        .summary-card h3 {
          margin: 0 0 10px 0;
          color: #6b7280;
          font-size: 14px;
        }
        .summary-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #111827;
        }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
          font-weight: bold;
          color: #1e40af;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .text-right {
          text-align: right;
        }
        @media print {
          body { padding: 20px; }
          .summary-grid { page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>${report.reportTitle}</h1>
      <div class="info">Generated on ${formatDate(report.generatedAt)}</div>

      <h2>Overall Performance</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <h3>Total Invested</h3>
          <div class="value">${formatCurrency(report.totalInvested)}</div>
        </div>
        <div class="summary-card">
          <h3>Current Value</h3>
          <div class="value">${formatCurrency(report.currentValue)}</div>
        </div>
        <div class="summary-card">
          <h3>Total Gain/Loss</h3>
          <div class="value ${
            report.totalGainLoss >= 0 ? 'positive' : 'negative'
          }">
            ${report.totalGainLoss >= 0 ? '+' : ''}${formatCurrency(
    report.totalGainLoss
  )}
          </div>
        </div>
        <div class="summary-card">
          <h3>Return Percentage</h3>
          <div class="value ${
            report.totalGainLossPercentage >= 0 ? 'positive' : 'negative'
          }">
            ${
              report.totalGainLossPercentage >= 0 ? '+' : ''
            }${report.totalGainLossPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <h2>Investment Breakdown</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <h3>Total Investments</h3>
          <div class="value">${report.totalInvestments}</div>
        </div>
        <div class="summary-card">
          <h3>Active Investments</h3>
          <div class="value">${report.activeInvestments}</div>
        </div>
        <div class="summary-card">
          <h3>Sold Investments</h3>
          <div class="value">${report.soldInvestments}</div>
        </div>
        <div class="summary-card">
          <h3>On Hold Investments</h3>
          <div class="value">${report.onHoldInvestments}</div>
        </div>
      </div>

      ${
        report.topPerformers.length > 0
          ? `
        <h2>Top Performers</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th class="text-right">Initial Amount</th>
              <th class="text-right">Current Value</th>
              <th class="text-right">Gain/Loss</th>
              <th class="text-right">Return %</th>
            </tr>
          </thead>
          <tbody>
            ${report.topPerformers
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td class="text-right">${formatCurrency(
                  item.initialAmount
                )}</td>
                <td class="text-right">${formatCurrency(item.currentValue)}</td>
                <td class="text-right positive">+${formatCurrency(
                  item.gainLoss
                )}</td>
                <td class="text-right positive">+${item.gainLossPercentage.toFixed(
                  2
                )}%</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      ${
        report.performanceByType.length > 0
          ? `
        <h2>Performance by Type</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th class="text-right">Count</th>
              <th class="text-right">Total Invested</th>
              <th class="text-right">Current Value</th>
              <th class="text-right">Gain/Loss</th>
              <th class="text-right">Return %</th>
            </tr>
          </thead>
          <tbody>
            ${report.performanceByType
              .map(
                (item) => `
              <tr>
                <td>${item.type}</td>
                <td class="text-right">${item.count}</td>
                <td class="text-right">${formatCurrency(
                  item.totalInvested
                )}</td>
                <td class="text-right">${formatCurrency(item.currentValue)}</td>
                <td class="text-right ${
                  item.gainLoss >= 0 ? 'positive' : 'negative'
                }">
                  ${item.gainLoss >= 0 ? '+' : ''}${formatCurrency(
                  item.gainLoss
                )}
                </td>
                <td class="text-right ${
                  item.gainLossPercentage >= 0 ? 'positive' : 'negative'
                }">
                  ${
                    item.gainLossPercentage >= 0 ? '+' : ''
                  }${item.gainLossPercentage.toFixed(2)}%
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      ${
        report.monthlyTrend.length > 0
          ? `
        <h2>Monthly Performance Trend</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th class="text-right">Value</th>
              <th class="text-right">Invested Amount</th>
              <th class="text-right">Gain/Loss</th>
              <th class="text-right">Return %</th>
            </tr>
          </thead>
          <tbody>
            ${report.monthlyTrend
              .map(
                (item) => `
              <tr>
                <td>${item.month}</td>
                <td class="text-right">${formatCurrency(item.value)}</td>
                <td class="text-right">${formatCurrency(
                  item.investedAmount
                )}</td>
                <td class="text-right ${
                  item.gainLoss >= 0 ? 'positive' : 'negative'
                }">
                  ${item.gainLoss >= 0 ? '+' : ''}${formatCurrency(
                  item.gainLoss
                )}
                </td>
                <td class="text-right ${
                  item.gainLossPercentage >= 0 ? 'positive' : 'negative'
                }">
                  ${
                    item.gainLossPercentage >= 0 ? '+' : ''
                  }${item.gainLossPercentage.toFixed(2)}%
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }
    </body>
    </html>
  `;
};

// Format Investment Distribution to HTML for PDF
const formatInvestmentDistributionToHTML = (
  report: InvestmentDistributionReport
): string => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${report.reportTitle}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        h1 {
          color: #1e40af;
          border-bottom: 3px solid #1e40af;
          padding-bottom: 10px;
        }
        h2 {
          color: #1e40af;
          margin-top: 30px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .info {
          color: #6b7280;
          margin-bottom: 20px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        .summary-card {
          border: 1px solid #e5e7eb;
          padding: 15px;
          border-radius: 8px;
        }
        .summary-card h3 {
          margin: 0 0 10px 0;
          color: #6b7280;
          font-size: 14px;
        }
        .summary-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #111827;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
          font-weight: bold;
          color: #1e40af;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .text-right {
          text-align: right;
        }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        @media print {
          body { padding: 20px; }
          .summary-grid { page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>${report.reportTitle}</h1>
      <div class="info">Generated on ${formatDate(report.generatedAt)}</div>

      <div class="summary-grid">
        <div class="summary-card">
          <h3>Total Portfolio Value</h3>
          <div class="value">${formatCurrency(report.totalPortfolioValue)}</div>
        </div>
        <div class="summary-card">
          <h3>Total Investments</h3>
          <div class="value">${report.totalInvestments}</div>
        </div>
      </div>

      ${
        report.distributionByType.length > 0
          ? `
        <h2>Distribution by Type</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th class="text-right">Count</th>
              <th class="text-right">Value</th>
              <th class="text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${report.distributionByType
              .map(
                (item) => `
              <tr>
                <td>${item.category}</td>
                <td class="text-right">${item.count}</td>
                <td class="text-right">${formatCurrency(item.value)}</td>
                <td class="text-right">${item.percentage.toFixed(1)}%</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      ${
        report.distributionByStatus.length > 0
          ? `
        <h2>Distribution by Status</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th class="text-right">Count</th>
              <th class="text-right">Value</th>
              <th class="text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${report.distributionByStatus
              .map(
                (item) => `
              <tr>
                <td>${item.category}</td>
                <td class="text-right">${item.count}</td>
                <td class="text-right">${formatCurrency(item.value)}</td>
                <td class="text-right">${item.percentage.toFixed(1)}%</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      ${
        report.investmentSizeDistribution.length > 0
          ? `
        <h2>Investment Size Distribution</h2>
        <table>
          <thead>
            <tr>
              <th>Range</th>
              <th class="text-right">Count</th>
              <th class="text-right">Total Value</th>
            </tr>
          </thead>
          <tbody>
            ${report.investmentSizeDistribution
              .map(
                (item) => `
              <tr>
                <td>${item.range}</td>
                <td class="text-right">${item.count}</td>
                <td class="text-right">${formatCurrency(item.totalValue)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      ${
        report.investments.length > 0
          ? `
        <h2>All Investments</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th class="text-right">Initial Amount</th>
              <th class="text-right">Current Value</th>
              <th class="text-right">Gain/Loss</th>
              <th class="text-right">Return %</th>
            </tr>
          </thead>
          <tbody>
            ${report.investments
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.status}</td>
                <td class="text-right">${formatCurrency(
                  item.initialAmount
                )}</td>
                <td class="text-right">${formatCurrency(item.currentValue)}</td>
                <td class="text-right ${
                  item.gainLoss >= 0 ? 'positive' : 'negative'
                }">
                  ${item.gainLoss >= 0 ? '+' : ''}${formatCurrency(
                  item.gainLoss
                )}
                </td>
                <td class="text-right ${
                  item.gainLossPercentage >= 0 ? 'positive' : 'negative'
                }">
                  ${
                    item.gainLossPercentage >= 0 ? '+' : ''
                  }${item.gainLossPercentage.toFixed(2)}%
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }
    </body>
    </html>
  `;
};

// Format Transaction History to HTML for PDF
const formatTransactionHistoryToHTML = (
  report: TransactionHistoryReport
): string => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${report.reportTitle}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        h1 {
          color: #1e40af;
          border-bottom: 3px solid #1e40af;
          padding-bottom: 10px;
        }
        h2 {
          color: #1e40af;
          margin-top: 30px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .info {
          color: #6b7280;
          margin-bottom: 20px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        .summary-card {
          border: 1px solid #e5e7eb;
          padding: 15px;
          border-radius: 8px;
        }
        .summary-card h3 {
          margin: 0 0 10px 0;
          color: #6b7280;
          font-size: 14px;
        }
        .summary-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #111827;
        }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
          font-weight: bold;
          color: #1e40af;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .text-right {
          text-align: right;
        }
        @media print {
          body { padding: 20px; }
          .summary-grid { page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>${report.reportTitle}</h1>
      <div class="info">Generated on ${formatDate(report.generatedAt)}</div>
      ${
        report.periodStart && report.periodEnd
          ? `<div class="info">Period: ${formatDate(
              report.periodStart
            )} to ${formatDate(report.periodEnd)}</div>`
          : ''
      }

      <h2>Transaction Summary</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <h3>Total Transactions</h3>
          <div class="value">${report.totalTransactions}</div>
        </div>
        <div class="summary-card">
          <h3>Total Volume</h3>
          <div class="value">${formatCurrency(report.totalVolume)}</div>
        </div>
        <div class="summary-card">
          <h3>Buy Volume</h3>
          <div class="value positive">${formatCurrency(report.buyVolume)}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">
            ${report.buyTransactions} transactions
          </div>
        </div>
        <div class="summary-card">
          <h3>Sell Volume</h3>
          <div class="value negative">${formatCurrency(report.sellVolume)}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">
            ${report.sellTransactions} transactions
          </div>
        </div>
      </div>

      ${
        report.transactionsByType.length > 0
          ? `
        <h2>Transactions by Type</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th class="text-right">Count</th>
              <th class="text-right">Volume</th>
              <th class="text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${report.transactionsByType
              .map(
                (item) => `
              <tr>
                <td>${item.type}</td>
                <td class="text-right">${item.count}</td>
                <td class="text-right">${formatCurrency(item.volume)}</td>
                <td class="text-right">${item.percentage.toFixed(1)}%</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      ${
        report.transactionsByMonth.length > 0
          ? `
        <h2>Monthly Transaction Volume</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th class="text-right">Count</th>
              <th class="text-right">Volume</th>
            </tr>
          </thead>
          <tbody>
            ${report.transactionsByMonth
              .map(
                (item) => `
              <tr>
                <td>${item.month}</td>
                <td class="text-right">${item.count}</td>
                <td class="text-right">${formatCurrency(item.volume)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      ${
        report.transactions.length > 0
          ? `
        <h2>Transaction Details</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Investment</th>
              <th>Type</th>
              <th>Transaction</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Price/Unit</th>
              <th class="text-right">Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${report.transactions
              .map(
                (item) => `
              <tr>
                <td>${formatDateTime(item.date)}</td>
                <td>${item.investmentName}</td>
                <td>${item.investmentType}</td>
                <td>${item.transactionType}</td>
                <td class="text-right">${formatNumber(item.quantity)}</td>
                <td class="text-right">${formatCurrency(item.pricePerUnit)}</td>
                <td class="text-right">${formatCurrency(item.amount)}</td>
                <td>${item.notes || '-'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }
    </body>
    </html>
  `;
};

// Format Year-over-Year to CSV
const formatYearOverYearToCSV = (report: YearOverYearReport): string => {
  let csv = 'Year-over-Year Comparison Report\n\n';
  csv += `Generated At,${report.generatedAt}\n\n`;

  // Best and Worst Years
  if (report.bestYear) {
    csv += 'Best Performing Year\n';
    csv += `Year,${report.bestYear.year}\n`;
    csv += `Starting Value,${report.bestYear.startingValue}\n`;
    csv += `Ending Value,${report.bestYear.endingValue}\n`;
    csv += `Growth,${report.bestYear.growth}\n`;
    csv += `Growth Percentage,${report.bestYear.growthPercentage}%\n\n`;
  }

  if (report.worstYear) {
    csv += 'Challenging Year\n';
    csv += `Year,${report.worstYear.year}\n`;
    csv += `Starting Value,${report.worstYear.startingValue}\n`;
    csv += `Ending Value,${report.worstYear.endingValue}\n`;
    csv += `Growth,${report.worstYear.growth}\n`;
    csv += `Growth Percentage,${report.worstYear.growthPercentage}%\n\n`;
  }

  // Yearly Summaries
  csv += 'Yearly Performance Summary\n';
  csv +=
    'Year,Starting Value,Ending Value,Total Invested,Growth,Growth %,Transactions,Transaction Volume,New Investments\n';
  report.yearlySummaries.forEach((year) => {
    csv += `${year.year},${year.startingValue},${year.endingValue},${year.totalInvested},${year.growth},${year.growthPercentage}%,${year.totalTransactions},${year.transactionVolume},${year.newInvestments}\n`;
  });
  csv += '\n';

  // Year-over-Year Growth
  if (report.yearOverYearGrowth.length > 0) {
    csv += 'Year-over-Year Growth Analysis\n';
    csv +=
      'Comparison,Growth Difference,Growth Difference %,Transaction Count Difference\n';
    report.yearOverYearGrowth.forEach((growth) => {
      csv += `${growth.comparison},${growth.growthDifference},${growth.growthDifferencePercentage}%,${growth.transactionCountDifference}\n`;
    });
  }

  return csv;
};

// Format Year-over-Year to HTML for PDF
const formatYearOverYearToHTML = (report: YearOverYearReport): string => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const formatPercentage = (value: number) => {
    const formatted = value.toFixed(2);
    return `${value >= 0 ? '+' : ''}${formatted}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Year-over-Year Comparison Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: white;
          color: #1e293b;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        h1 { font-size: 28px; color: #0f172a; margin-bottom: 10px; }
        .meta { color: #64748b; font-size: 14px; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        .key-metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .metric-card {
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .metric-card.best { background: #f0fdf4; border-color: #86efac; }
        .metric-card.worst { background: #fef2f2; border-color: #fca5a5; }
        .metric-card h3 {
          font-size: 16px;
          margin-bottom: 12px;
          color: #0f172a;
        }
        .metric-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .metric-label { color: #64748b; }
        .metric-value { font-weight: 600; }
        .positive { color: #16a34a; }
        .negative { color: #dc2626; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 13px;
        }
        thead {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }
        th {
          text-align: left;
          padding: 12px 8px;
          font-weight: 600;
          color: #475569;
        }
        th.text-right { text-align: right; }
        th.text-center { text-align: center; }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #f1f5f9;
        }
        td.text-right { text-align: right; }
        td.text-center { text-align: center; }
        tbody tr:hover { background: #f8fafc; }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          background: #e2e8f0;
          color: #475569;
        }
        @media print {
          body { padding: 20px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${report.reportTitle}</h1>
        <div class="meta">Generated on ${formatDate(report.generatedAt)}</div>
        <div class="meta">Years Covered: ${report.yearsCovered.join(', ')}</div>
      </div>

      ${
        report.bestYear || report.worstYear
          ? `
      <div class="section">
        <div class="section-title">Key Performance Highlights</div>
        <div class="key-metrics">
          ${
            report.bestYear
              ? `
          <div class="metric-card best">
            <h3>🏆 Best Performing Year: ${report.bestYear.year}</h3>
            <div class="metric-row">
              <span class="metric-label">Starting Value:</span>
              <span class="metric-value">${formatCurrency(
                report.bestYear.startingValue
              )}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Ending Value:</span>
              <span class="metric-value">${formatCurrency(
                report.bestYear.endingValue
              )}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Growth:</span>
              <span class="metric-value positive">${formatCurrency(
                report.bestYear.growth
              )} (${formatPercentage(report.bestYear.growthPercentage)})</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Transactions:</span>
              <span class="metric-value">${
                report.bestYear.totalTransactions
              }</span>
            </div>
          </div>
          `
              : ''
          }
          ${
            report.worstYear
              ? `
          <div class="metric-card worst">
            <h3>⚠️ Challenging Year: ${report.worstYear.year}</h3>
            <div class="metric-row">
              <span class="metric-label">Starting Value:</span>
              <span class="metric-value">${formatCurrency(
                report.worstYear.startingValue
              )}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Ending Value:</span>
              <span class="metric-value">${formatCurrency(
                report.worstYear.endingValue
              )}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Growth:</span>
              <span class="metric-value ${
                report.worstYear.growth >= 0 ? 'positive' : 'negative'
              }">${formatCurrency(report.worstYear.growth)} (${formatPercentage(
                  report.worstYear.growthPercentage
                )})</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Transactions:</span>
              <span class="metric-value">${
                report.worstYear.totalTransactions
              }</span>
            </div>
          </div>
          `
              : ''
          }
        </div>
      </div>
      `
          : ''
      }

      <div class="section">
        <div class="section-title">Yearly Performance Summary</div>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th class="text-right">Starting Value</th>
              <th class="text-right">Ending Value</th>
              <th class="text-right">Total Invested</th>
              <th class="text-right">Growth</th>
              <th class="text-right">Growth %</th>
              <th class="text-center">Transactions</th>
              <th class="text-center">New Investments</th>
            </tr>
          </thead>
          <tbody>
            ${report.yearlySummaries
              .map(
                (year) => `
              <tr>
                <td><span class="badge">${year.year}</span></td>
                <td class="text-right">${formatCurrency(
                  year.startingValue
                )}</td>
                <td class="text-right"><strong>${formatCurrency(
                  year.endingValue
                )}</strong></td>
                <td class="text-right">${formatCurrency(
                  year.totalInvested
                )}</td>
                <td class="text-right ${
                  year.growth >= 0 ? 'positive' : 'negative'
                }"><strong>${formatCurrency(year.growth)}</strong></td>
                <td class="text-right ${
                  year.growthPercentage >= 0 ? 'positive' : 'negative'
                }"><strong>${formatPercentage(
                  year.growthPercentage
                )}</strong></td>
                <td class="text-center"><span class="badge">${
                  year.totalTransactions
                }</span></td>
                <td class="text-center"><span class="badge">${
                  year.newInvestments
                }</span></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      ${
        report.yearOverYearGrowth.length > 0
          ? `
      <div class="section">
        <div class="section-title">Year-over-Year Growth Analysis</div>
        <table>
          <thead>
            <tr>
              <th>Comparison</th>
              <th class="text-right">Growth Difference</th>
              <th class="text-right">Growth Difference %</th>
              <th class="text-center">Transaction Change</th>
            </tr>
          </thead>
          <tbody>
            ${report.yearOverYearGrowth
              .map(
                (growth) => `
              <tr>
                <td><strong>${growth.comparison}</strong></td>
                <td class="text-right ${
                  growth.growthDifference >= 0 ? 'positive' : 'negative'
                }"><strong>${formatCurrency(
                  growth.growthDifference
                )}</strong></td>
                <td class="text-right ${
                  growth.growthDifferencePercentage >= 0
                    ? 'positive'
                    : 'negative'
                }"><strong>${formatPercentage(
                  growth.growthDifferencePercentage
                )}</strong></td>
                <td class="text-center"><span class="badge">${
                  growth.transactionCountDifference >= 0 ? '+' : ''
                }${growth.transactionCountDifference}</span></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
      `
          : ''
      }
    </body>
    </html>
  `;
};

// Format Top Performing Investments to CSV
const formatTopPerformingToCSV = (
  report: TopPerformingInvestmentsReport
): string => {
  let csv = 'Top Performing Investments Report\n\n';
  csv += `Generated At,${report.generatedAt}\n`;
  if (report.periodStart && report.periodEnd) {
    csv += `Period,${report.periodStart} to ${report.periodEnd}\n`;
  }
  csv += `Total Investments Analyzed,${report.totalInvestmentsAnalyzed}\n\n`;

  // Top by Percentage
  csv += 'Top Performers by Gain/Loss Percentage\n';
  csv +=
    'Rank,Investment,Type,Status,Initial Amount,Current Value,Gain/Loss,Return %,Annualized Return,Days Held,Purchase Date\n';
  report.topByPercentage.forEach((item) => {
    csv += `${item.rank},${item.name},${item.type},${item.status},${item.initialAmount},${item.currentValue},${item.gainLoss},${item.gainLossPercentage}%,${item.annualizedReturn}%,${item.daysHeld},${item.purchaseDate}\n`;
  });
  csv += '\n';

  // Top by Absolute Gain
  csv += 'Top Performers by Absolute Gain\n';
  csv +=
    'Rank,Investment,Type,Status,Initial Amount,Current Value,Gain/Loss,Return %,Purchase Date\n';
  report.topByAbsoluteGain.forEach((item) => {
    csv += `${item.rank},${item.name},${item.type},${item.status},${item.initialAmount},${item.currentValue},${item.gainLoss},${item.gainLossPercentage}%,${item.purchaseDate}\n`;
  });
  csv += '\n';

  // Top by Value
  csv += 'Top Investments by Current Value\n';
  csv +=
    'Rank,Investment,Type,Status,Initial Amount,Current Value,Gain/Loss,Return %,Purchase Date\n';
  report.topByValue.forEach((item) => {
    csv += `${item.rank},${item.name},${item.type},${item.status},${item.initialAmount},${item.currentValue},${item.gainLoss},${item.gainLossPercentage}%,${item.purchaseDate}\n`;
  });
  csv += '\n';

  // Type Performance Summary
  if (report.typePerformanceSummaries.length > 0) {
    csv += 'Performance by Investment Type\n';
    csv += 'Type,Count,Avg Return %,Best Performance %,Worst Performance %\n';
    report.typePerformanceSummaries.forEach((summary) => {
      csv += `${summary.type},${summary.count},${summary.averageGainLossPercentage}%,${summary.bestPerformancePercentage}%,${summary.worstPerformancePercentage}%\n`;
    });
  }

  return csv;
};

// Format Top Performing Investments to HTML for PDF
const formatTopPerformingToHTML = (
  report: TopPerformingInvestmentsReport
): string => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const formatPercentage = (value: number) => {
    const formatted = value.toFixed(2);
    return `${value >= 0 ? '+' : ''}${formatted}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Top Performing Investments Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: white;
          color: #1e293b;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        h1 { font-size: 28px; color: #0f172a; margin-bottom: 10px; }
        .meta { color: #64748b; font-size: 14px; margin-bottom: 5px; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        .summary-card {
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }
        .summary-stat {
          font-size: 32px;
          font-weight: bold;
          color: #0ea5e9;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 12px;
        }
        thead {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }
        th {
          text-align: left;
          padding: 10px 6px;
          font-weight: 600;
          color: #475569;
        }
        th.text-right { text-align: right; }
        th.text-center { text-align: center; }
        td {
          padding: 8px 6px;
          border-bottom: 1px solid #f1f5f9;
        }
        td.text-right { text-align: right; }
        td.text-center { text-align: center; }
        tbody tr:hover { background: #f8fafc; }
        .positive { color: #16a34a; font-weight: 600; }
        .negative { color: #dc2626; font-weight: 600; }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          background: #e2e8f0;
          color: #475569;
        }
        .rank { font-weight: bold; color: #64748b; }
        .rank-1 { color: #eab308; }
        .rank-2 { color: #94a3b8; }
        .rank-3 { color: #d97706; }
        @media print {
          body { padding: 20px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${report.reportTitle}</h1>
        <div class="meta">Generated on ${formatDateTime(
          report.generatedAt
        )}</div>
        ${
          report.periodStart && report.periodEnd
            ? `<div class="meta">Period: ${formatDate(
                report.periodStart
              )} - ${formatDate(report.periodEnd)}</div>`
            : ''
        }
      </div>

      <div class="section">
        <div class="summary-card">
          <div class="meta">Total Investments Analyzed</div>
          <div class="summary-stat">${report.totalInvestmentsAnalyzed}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Top Performers by Gain/Loss Percentage</div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Investment</th>
              <th>Type</th>
              <th>Status</th>
              <th class="text-right">Initial</th>
              <th class="text-right">Current</th>
              <th class="text-right">Gain/Loss</th>
              <th class="text-right">Return %</th>
              <th class="text-right">Ann. Return</th>
              <th class="text-right">Days Held</th>
            </tr>
          </thead>
          <tbody>
            ${report.topByPercentage
              .map(
                (item) => `
              <tr>
                <td class="rank rank-${item.rank}">#${item.rank}</td>
                <td><strong>${item.name}</strong></td>
                <td><span class="badge">${item.type}</span></td>
                <td><span class="badge">${item.status}</span></td>
                <td class="text-right">${formatCurrency(
                  item.initialAmount
                )}</td>
                <td class="text-right"><strong>${formatCurrency(
                  item.currentValue
                )}</strong></td>
                <td class="text-right ${
                  item.gainLoss >= 0 ? 'positive' : 'negative'
                }"><strong>${formatCurrency(item.gainLoss)}</strong></td>
                <td class="text-right ${
                  item.gainLossPercentage >= 0 ? 'positive' : 'negative'
                }"><strong>${formatPercentage(
                  item.gainLossPercentage
                )}</strong></td>
                <td class="text-right ${
                  item.annualizedReturn >= 0 ? 'positive' : 'negative'
                }">${formatPercentage(item.annualizedReturn)}</td>
                <td class="text-right">${item.daysHeld}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Top Performers by Absolute Gain</div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Investment</th>
              <th>Type</th>
              <th>Status</th>
              <th class="text-right">Initial</th>
              <th class="text-right">Current</th>
              <th class="text-right">Gain/Loss</th>
              <th class="text-right">Return %</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            ${report.topByAbsoluteGain
              .map(
                (item) => `
              <tr>
                <td class="rank rank-${item.rank}">#${item.rank}</td>
                <td><strong>${item.name}</strong></td>
                <td><span class="badge">${item.type}</span></td>
                <td><span class="badge">${item.status}</span></td>
                <td class="text-right">${formatCurrency(
                  item.initialAmount
                )}</td>
                <td class="text-right"><strong>${formatCurrency(
                  item.currentValue
                )}</strong></td>
                <td class="text-right ${
                  item.gainLoss >= 0 ? 'positive' : 'negative'
                }"><strong>${formatCurrency(item.gainLoss)}</strong></td>
                <td class="text-right ${
                  item.gainLossPercentage >= 0 ? 'positive' : 'negative'
                }">${formatPercentage(item.gainLossPercentage)}</td>
                <td>${formatDate(item.purchaseDate)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Top Investments by Current Value</div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Investment</th>
              <th>Type</th>
              <th>Status</th>
              <th class="text-right">Initial</th>
              <th class="text-right">Current</th>
              <th class="text-right">Gain/Loss</th>
              <th class="text-right">Return %</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            ${report.topByValue
              .map(
                (item) => `
              <tr>
                <td class="rank rank-${item.rank}">#${item.rank}</td>
                <td><strong>${item.name}</strong></td>
                <td><span class="badge">${item.type}</span></td>
                <td><span class="badge">${item.status}</span></td>
                <td class="text-right">${formatCurrency(
                  item.initialAmount
                )}</td>
                <td class="text-right"><strong>${formatCurrency(
                  item.currentValue
                )}</strong></td>
                <td class="text-right ${
                  item.gainLoss >= 0 ? 'positive' : 'negative'
                }">${formatCurrency(item.gainLoss)}</td>
                <td class="text-right ${
                  item.gainLossPercentage >= 0 ? 'positive' : 'negative'
                }">${formatPercentage(item.gainLossPercentage)}</td>
                <td>${formatDate(item.purchaseDate)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      ${
        report.typePerformanceSummaries.length > 0
          ? `
      <div class="section">
        <div class="section-title">Performance by Investment Type</div>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th class="text-center">Count</th>
              <th class="text-right">Avg Return %</th>
              <th class="text-right">Best Performance</th>
              <th class="text-right">Worst Performance</th>
            </tr>
          </thead>
          <tbody>
            ${report.typePerformanceSummaries
              .map(
                (summary) => `
              <tr>
                <td><span class="badge">${summary.type}</span></td>
                <td class="text-center"><span class="badge">${
                  summary.count
                }</span></td>
                <td class="text-right ${
                  summary.averageGainLossPercentage >= 0
                    ? 'positive'
                    : 'negative'
                }"><strong>${formatPercentage(
                  summary.averageGainLossPercentage
                )}</strong></td>
                <td class="text-right positive">${formatPercentage(
                  summary.bestPerformancePercentage
                )}</td>
                <td class="text-right negative">${formatPercentage(
                  summary.worstPerformancePercentage
                )}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
      `
          : ''
      }
    </body>
    </html>
  `;
};

// Helper function to download file
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
