'use client';

import { cn } from '@/lib';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const page = Number(params.get('page') ?? 0);

  return (
    <div className='mx-auto mt-5 flex w-full items-center justify-center gap-5'>
      {Array.from({ length: totalPages }, (_, index) => {
        const isActive = index === page;

        return (
          <div key={index}>
            {isActive ? (
              <span
                className={cn(
                  'bg-background flex h-10 w-10 cursor-default cursor-pointer items-center justify-center rounded'
                )}
              >
                {index + 1}
              </span>
            ) : (
              <Link
                className={cn(
                  'bg-sidebar hover:bg-muted flex h-10 w-10 items-center justify-center rounded'
                )}
                href={`${pathname}?page=${index}`}
              >
                {index + 1}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
