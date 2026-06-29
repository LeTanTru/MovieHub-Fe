'use client';

import { FallingStarIcon } from '@/assets';
import { TopViewItem } from './top-view-item';
import { useTopViewMovieListQuery } from '@/queries';
import { Skeleton } from '@/components/ui/skeleton';

const TOP_VIEW_SKELETON_COUNT = 3;

export function TopViewList() {
  const { data: topViewMovieListData } = useTopViewMovieListQuery({
    enabled: true
  });

  const topViewMovieList = topViewMovieListData?.content || [];

  if (topViewMovieList.length === 0) return null;

  return (
    <div className='max-1120:hidden border-t border-solid border-white/10 pt-4'>
      <div className='mb-4 flex items-center gap-4 text-xl font-semibold text-white'>
        <div className='size-6 shrink-0'>
          <FallingStarIcon className='size-full' />
        </div>
        Top phim tuần này
      </div>
      <div className='top-view-list flex flex-col gap-4'>
        {topViewMovieList.map((movie, index) => (
          <TopViewItem key={movie.id} movie={movie} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

TopViewList.Skeleton = function TopViewListSkeleton() {
  return (
    <div className='max-1120:hidden border-t border-solid border-white/10 pt-4'>
      <div className='mb-4 flex h-7 items-center gap-4'>
        <Skeleton className='skeleton size-6 rounded!' />
        <Skeleton className='skeleton h-6 w-32' />
      </div>
      <div className='flex flex-col gap-4'>
        {Array.from({ length: TOP_VIEW_SKELETON_COUNT }).map((_, index) => (
          <div
            key={`top-view-skeleton-${index}`}
            className='flex items-center justify-between gap-2'
          >
            <Skeleton className='skeleton h-14 w-15 shrink-0' />
            <div className='flex grow items-center justify-between rounded bg-white/5 p-2.5'>
              <div className='w-20 shrink-0'>
                <div className='bg-gunmetal-blue relative block h-0 w-full rounded pb-[150%]'>
                  <Skeleton className='skeleton absolute! top-0 left-0 size-full rounded!' />
                </div>
              </div>
              <div className='grow px-4'>
                <Skeleton className='skeleton mb-1.5 h-4 w-3/4' />
                <Skeleton className='skeleton mb-2 h-3 w-1/2' />
                <div className='flex items-center gap-4'>
                  <Skeleton className='skeleton h-3 w-6' />
                  <Skeleton className='skeleton h-3 w-8' />
                  <Skeleton className='skeleton h-3 w-10' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
