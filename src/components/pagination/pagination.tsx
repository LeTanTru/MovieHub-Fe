'use client';

import { cn } from '@/lib';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { scroller } from 'react-scroll';

type PaginationProps = {
  totalPages: number;
  page?: number;
  to?: string;
  scrollOptions?: any;
  onPageChange?: (page: number) => void;
};

export default function Pagination({
  totalPages,
  page,
  to,
  scrollOptions,
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
    if (to) {
      scroller.scrollTo(to, {
        duration: 200,
        delay: 0,
        smooth: true,
        offset: -100,
        isDynamic: true,
        ...scrollOptions
      });
    }
  };

  const handleScroll = () => {
    if (to) {
      scroller.scrollTo(to, {
        duration: 200,
        delay: 0,
        smooth: true,
        offset: -100,
        isDynamic: true,
        ...scrollOptions
      });
    }
  };

  const renderPage = (page: number) => {
    const isActive = page === currentPage;
    return isActive ? (
      <span
        key={page}
        className={cn(
          'bg-background flex h-10 w-10 items-center justify-center rounded font-medium'
        )}
        aria-label='current page'
      >
        {page}
      </span>
    ) : isControlled ? (
      <button
        key={page}
        type='button'
        onClick={() => handlePageClick(page)}
        className={cn(
          'hover:bg-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded transition-colors duration-200 ease-linear'
        )}
      >
        {page}
      </button>
    ) : (
      <Link
        key={page}
        href={createPageLink(page)}
        onClick={handleScroll}
        className={cn(
          'hover:bg-muted flex h-10 w-10 items-center justify-center rounded transition-colors duration-200 ease-linear'
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
            className='hover:bg-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded transition-colors duration-200 ease-linear'
            aria-label='Prev button'
          >
            <FaAngleLeft />
          </button>
        ) : (
          <Link
            href={createPageLink(currentPage - 1)}
            onClick={handleScroll}
            className='hover:bg-muted flex h-10 w-10 items-center justify-center rounded transition-colors duration-200 ease-linear'
          >
            <FaAngleLeft />
          </Link>
        )
      ) : (
        <span className='flex h-10 w-10 items-center justify-center rounded opacity-50'>
          <FaAngleLeft />
        </span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`dots-${i === 1 ? 'start' : 'end'}`}
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
            className='hover:bg-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded transition-colors duration-200 ease-linear'
            aria-label='Next button'
          >
            <FaAngleRight />
          </button>
        ) : (
          <Link
            href={createPageLink(currentPage + 1)}
            onClick={handleScroll}
            className='hover:bg-muted flex h-10 w-10 items-center justify-center rounded transition-colors duration-200 ease-linear'
          >
            <FaAngleRight />
          </Link>
        )
      ) : (
        <span className='flex h-10 w-10 items-center justify-center rounded opacity-50'>
          <FaAngleRight />
        </span>
      )}
    </div>
  );
}
