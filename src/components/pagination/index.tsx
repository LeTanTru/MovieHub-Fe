'use client';

import { cn } from '@/lib';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
  page?: number;
  onPageChange?: (page: number) => void;
};

export default function Pagination({
  totalPages,
  page,
  onPageChange
}: PaginationProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const isControlled = typeof onPageChange === 'function';
  const currentPage = isControlled
    ? (page ?? 1)
    : Number(params.get('page') ?? 1);

  const createPageLink = (page: number) => {
    if (page === 1) return pathname;
    const newParams = new URLSearchParams(params.toString());
    newParams.set('page', String(page));
    return `${pathname}?${newParams.toString()}`;
  };

  if (totalPages <= 1) return null;

  const handlePageClick = (nextPage: number) => {
    if (!isControlled || nextPage === currentPage) return;
    onPageChange?.(nextPage);
  };

  const renderPage = (page: number) => {
    const isActive = page === currentPage;
    return isActive ? (
      <span
        key={page}
        className={cn(
          'bg-background flex h-10 w-10 items-center justify-center rounded font-medium'
        )}
      >
        {page}
      </span>
    ) : isControlled ? (
      <button
        key={page}
        type='button'
        onClick={() => handlePageClick(page)}
        className={cn(
          'bg-sidebar hover:bg-muted flex h-10 w-10 items-center justify-center rounded'
        )}
      >
        {page}
      </button>
    ) : (
      <Link
        key={page}
        href={createPageLink(page)}
        className={cn(
          'bg-sidebar hover:bg-muted flex h-10 w-10 items-center justify-center rounded'
        )}
      >
        {page}
      </Link>
    );
  };

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ];
  };

  const pages = getVisiblePages();

  return (
    <div className='mx-auto mt-5 flex w-full items-center justify-center gap-2'>
      {currentPage > 1 ? (
        isControlled ? (
          <button
            type='button'
            onClick={() => handlePageClick(currentPage - 1)}
            className='bg-sidebar hover:bg-muted flex h-10 w-10 items-center justify-center rounded'
          >
            ‹
          </button>
        ) : (
          <Link
            href={createPageLink(currentPage - 1)}
            className='bg-sidebar hover:bg-muted flex h-10 w-10 items-center justify-center rounded'
          >
            ‹
          </Link>
        )
      ) : (
        <span className='flex h-10 w-10 items-center justify-center rounded opacity-50'>
          ‹
        </span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`dots-${i}`}
            className='text-muted-foreground flex h-10 w-10 items-center justify-center'
          >
            …
          </span>
        ) : (
          renderPage(p as number)
        )
      )}

      {currentPage < totalPages ? (
        isControlled ? (
          <button
            type='button'
            onClick={() => handlePageClick(currentPage + 1)}
            className='bg-sidebar hover:bg-muted flex h-10 w-10 items-center justify-center rounded'
          >
            ›
          </button>
        ) : (
          <Link
            href={createPageLink(currentPage + 1)}
            className='bg-sidebar hover:bg-muted flex h-10 w-10 items-center justify-center rounded'
          >
            ›
          </Link>
        )
      ) : (
        <span className='flex h-10 w-10 items-center justify-center rounded opacity-50'>
          ›
        </span>
      )}
    </div>
  );
}
