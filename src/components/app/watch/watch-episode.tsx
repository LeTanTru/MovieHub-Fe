'use client';

import { WatchSeries } from './watch-series';
import { WatchSingle } from './watch-single';
import { MOVIE_TYPE_SINGLE } from '@/constants';
import { useMovie } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';

export function WatchEpisode() {
  const { movie } = useMovie();

  const Tab = movie
    ? movie.type === MOVIE_TYPE_SINGLE
      ? WatchSingle
      : WatchSeries
    : null;

  if (!movie) return null;

  return (
    <div className='max-640:mb-2 max-1280:mt-0 my-4'>
      {Tab ? <Tab /> : null}
    </div>
  );
}

WatchEpisode.Skeleton = function WatchEpisodeSkeleton() {
  return (
    <div className='max-640:mb-2 my-4'>
      <Skeleton className='skeleton mb-4 h-6 w-40' />
      <div className='max-1360:grid-cols-5 max-1360:gap-y-6 max-800:grid-cols-4 max-640:grid-cols-3 max-640:gap-y-4 max-520:grid-cols-2 grid grid-cols-6 gap-x-2.5 gap-y-8'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={`tab-content-skeleton-${index}`}
            className='skeleton h-28 w-full'
          />
        ))}
      </div>
    </div>
  );
};
