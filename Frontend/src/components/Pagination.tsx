import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxPageButtons?: number;
}

const Pagination = ({
  totalRecords,
  pageSize,
  currentPage,
  onPageChange,
  maxPageButtons = 5,
}: PaginationProps) => {
  // Calculate total pages based on records and page size
  const totalPages = useMemo(
    () => Math.ceil(totalRecords / pageSize),
    [totalRecords, pageSize]
  );

  // Compute visible page numbers around the current page
  // This creates a "sliding window" of page numbers that moves as the user navigates
  const pageNumbers = useMemo(() => {
    // Calculate how many pages to show on each side of the current page
    const half = Math.floor(maxPageButtons / 2);

    // Start with the ideal start position (current page minus half the window)
    let start = Math.max(1, currentPage - half);

    // Calculate the ideal end position
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    // If we don't have enough pages to fill the window, adjust the start
    // This ensures we always show the maximum number of page buttons when possible
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    // Create an array of consecutive page numbers
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  }, [currentPage, totalPages, maxPageButtons]);

  // Don't render anything if there are no pages to display
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='flex items-center justify-center gap-2'>
      {/* First page button */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className='hidden sm:inline-flex' // Hide on mobile for space
      >
        First
      </Button>

      {/* Previous page button */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className='w-4 h-4' />
        <span className='sr-only'>Previous page</span>
      </Button>

      {/* Individual page number buttons */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          size='sm'
          variant={page === currentPage ? 'default' : 'outline'}
          onClick={() => onPageChange(page)}
          className='min-w-[2.5rem]' // Ensure consistent button width
        >
          {page}
        </Button>
      ))}

      {/* Next page button */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className='w-4 h-4' />
        <span className='sr-only'>Next page</span>
      </Button>

      {/* Last page button */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className='hidden sm:inline-flex' // Hide on mobile for space
      >
        Last
      </Button>
    </div>
  );
};

export default Pagination;
