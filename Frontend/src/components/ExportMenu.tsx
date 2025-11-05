import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { exportReport, type ExportFormat } from '@/utils/exportUtils';

interface ExportMenuProps {
  data: any;
  reportType: string;
  reportName?: string;
}

export const ExportMenu = ({
  data,
  reportType,
  reportName = 'Report',
}: ExportMenuProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    if (!data) {
      console.error('No data available for export');
      return;
    }

    setIsExporting(true);
    try {
      await exportReport(data, reportType, format);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          disabled={isExporting}
          className='border-light-400'
        >
          <Download className='mr-2 h-4 w-4' />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          className='cursor-pointer'
        >
          <FileText className='mr-2 h-4 w-4' />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          className='cursor-pointer'
        >
          <FileSpreadsheet className='mr-2 h-4 w-4' />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('json')}
          className='cursor-pointer'
        >
          <FileJson className='mr-2 h-4 w-4' />
          <span>Export as JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
