'use client';

import { MovieHistoryCard } from '@/components/app/movie-card';
import { MovieGrid } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { useMovieHistoryListQuery } from '@/queries';
import { useAuth, useWatchHistoryDelete } from '@/hooks';

export function WatchHistory() {
  const { isAuthenticated } = useAuth();

  const { data: movieHistories = [], isLoading } = useMovieHistoryListQuery({
    enabled: isAuthenticated
  });

  const { handleDeleteWatchHistory } = useWatchHistoryDelete();

  return (
    <div className='mb-8 flex flex-col items-start justify-between gap-4'>
      <h3 className='max-640:text-base text-xl leading-normal font-semibold text-white'>
        Xem tiếp
      </h3>
      {!isAuthenticated || isLoading ? (
        <MovieGrid.Skeleton
          className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-640:gap-y-6 max-480:gap-y-4 grid w-full grow grid-cols-6 gap-6'
          skeletonCount={12}
        />
      ) : movieHistories.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Bạn chưa xem phim nào.
              <br />
              Hãy khám phá và xem những bộ phim yêu thích của bạn ngay bây giờ
              😉
            </>
          }
        />
      ) : (
        <div className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-640:gap-y-6 max-480:gap-y-4 grid w-full grow grid-cols-6 gap-6'>
          {movieHistories.map((movieHistory) => (
            <MovieHistoryCard
              key={movieHistory.id}
              movieHistory={movieHistory}
              dir='down'
              onDelete={handleDeleteWatchHistory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
