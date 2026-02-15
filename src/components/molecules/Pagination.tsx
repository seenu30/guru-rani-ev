'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingsCount?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const getPageNumbers = (): (number | 'dots')[] => {
    // If total pages is small, show all
    if (totalPages <= 5 + siblingsCount * 2) {
      return range(1, totalPages);
    }

    const pages: (number | 'dots')[] = [];

    // Always show first page
    pages.push(1);

    // Left dots
    if (shouldShowLeftDots) {
      pages.push('dots');
    }

    // Sibling pages
    const siblingPages = range(leftSiblingIndex, rightSiblingIndex);
    siblingPages.forEach((page) => {
      if (page !== 1 && page !== totalPages) {
        pages.push(page);
      }
    });

    // Right dots
    if (shouldShowRightDots) {
      pages.push('dots');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonBaseStyles = cn(
    'inline-flex items-center justify-center',
    'min-w-[40px] h-10 px-3 rounded-md',
    'text-sm font-medium',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(buttonBaseStyles, 'text-text-muted hover:bg-surface')}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'dots') {
          return (
            <span
              key={`dots-${index}`}
              className="inline-flex items-center justify-center min-w-[40px] h-10 text-text-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              buttonBaseStyles,
              isActive
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'text-text-primary hover:bg-surface'
            )}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(buttonBaseStyles, 'text-text-muted hover:bg-surface')}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

export default Pagination;
