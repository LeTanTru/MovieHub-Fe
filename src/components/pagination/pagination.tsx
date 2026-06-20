'use client';

import { useQueryParams } from '@/hooks';
import { cn } from '@/lib';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { scroller } from 'react-scroll';

type ScrollOptions = Parameters<typeof scroller.scrollTo>[1];

type PaginationProps = {
  totalPages: number;
  page?: number;
  to?: string;
  scrollOptions?: ScrollOptions;
  onChange?: (page: number) => void;
};

const pageControlClassName =
  'hover:bg-muted max-640:size-9 flex size-10 items-center justify-center rounded transition-colors duration-200 ease-linear max-640:text-sm';
const disabledPageControlClassName =
  'max-640:size-9 flex size-10 items-center justify-center rounded opacity-50';
const mobilePageControlClassName =
  'hover:bg-muted flex size-9 items-center justify-center rounded transition-colors duration-200 ease-linear';
const mobileDisabledPageControlClassName =
  'flex size-9 items-center justify-center rounded opacity-50';

export function Pagination({
  totalPages,
  page,
  to,
  scrollOptions,
  onChange
}: PaginationProps) {
  const pathname = usePathname();
  const { searchParams, serializeParams } = useQueryParams();
  const isControlled = typeof onChange === 'function';
  const currentPage = isControlled
    ? (page ?? 1)
    : Number(searchParams.page ?? 1);

  const createPageLink = (page: number) => {
    const newParams = {
      ...searchParams,
      page: page === 1 ? null : String(page)
    };
    const queryString = serializeParams(newParams);
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  if (totalPages <= 1) return null;

  const handlePageClick = (nextPage: number) => {
    if (!isControlled || nextPage === currentPage) return;
    onChange?.(nextPage);
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

  const renderNavigation = ({
    targetPage,
    disabled,
    ariaLabel,
    className = pageControlClassName,
    disabledClassName = disabledPageControlClassName,
    children
  }: {
    targetPage: number;
    disabled: boolean;
    ariaLabel: string;
    className?: string;
    disabledClassName?: string;
    children: ReactNode;
  }) => {
    if (disabled) {
      return (
        <span className={disabledClassName} aria-hidden='true'>
          {children}
        </span>
      );
    }

    return isControlled ? (
      <button
        type='button'
        onClick={() => handlePageClick(targetPage)}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    ) : (
      <Link
        href={createPageLink(targetPage)}
        onClick={handleScroll}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  };

  const renderPage = (page: number) => {
    const isActive = page === currentPage;
    return isActive ? (
      <span
        key={page}
        className={cn(
          'bg-background max-640:size-9 max-640:text-sm flex size-10 items-center justify-center rounded font-medium'
        )}
        aria-current='page'
      >
        {page}
      </span>
    ) : isControlled ? (
      <button
        key={page}
        type='button'
        onClick={() => handlePageClick(page)}
        className={cn(pageControlClassName, 'cursor-pointer')}
        aria-label={`Page ${page}`}
      >
        {page}
      </button>
    ) : (
      <Link
        key={page}
        href={createPageLink(page)}
        onClick={handleScroll}
        className={cn(pageControlClassName)}
        aria-label={`Page ${page}`}
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
    <nav className='mt-5 w-full' aria-label='Pagination'>
      <div className='max-640:gap-1 max-480:hidden mx-auto flex w-full items-center justify-center gap-2'>
        {renderNavigation({
          targetPage: currentPage - 1,
          disabled: currentPage <= 1,
          ariaLabel: 'Previous page',
          children: <FaAngleLeft />
        })}

        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`dots-${i === 1 ? 'start' : 'end'}`}
              className='text-muted-foreground max-640:size-9 max-640:text-sm flex size-10 items-center justify-center'
            >
              ...
            </span>
          ) : (
            renderPage(p as number)
          )
        )}

        {renderNavigation({
          targetPage: currentPage + 1,
          disabled: currentPage >= totalPages,
          ariaLabel: 'Next page',
          children: <FaAngleRight />
        })}
      </div>

      <div className='max-480:flex mx-auto hidden w-full items-center justify-center gap-2'>
        {renderNavigation({
          targetPage: currentPage - 1,
          disabled: currentPage <= 1,
          ariaLabel: 'Previous page',
          className: mobilePageControlClassName,
          disabledClassName: mobileDisabledPageControlClassName,
          children: <FaAngleLeft />
        })}

        <span
          className='bg-background flex h-9 min-w-20 items-center justify-center rounded px-3 text-sm font-medium'
          aria-current='page'
          aria-label={`Page ${currentPage} of ${totalPages}`}
        >
          {currentPage} / {totalPages}
        </span>

        {renderNavigation({
          targetPage: currentPage + 1,
          disabled: currentPage >= totalPages,
          ariaLabel: 'Next page',
          className: mobilePageControlClassName,
          disabledClassName: mobileDisabledPageControlClassName,
          children: <FaAngleRight />
        })}
      </div>
    </nav>
  );
}
