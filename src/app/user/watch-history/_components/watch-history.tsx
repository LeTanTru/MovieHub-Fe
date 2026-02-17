'use client';

import { MovieCardHistory } from '@/components/app/movie-card';
import { MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { useMovieHistoryListQuery } from '@/queries';

export default function WatchHistory() {
  const { data: movieHistoriesData, isLoading } = useMovieHistoryListQuery({
    enabled: true
  });
  const movieHistories = movieHistoriesData?.data || [];

  return (
    <div className='mb-8 flex flex-col items-start justify-between gap-4'>
      <h3 className='text-xl leading-normal font-semibold text-white'>
        Xem tiếp
      </h3>
      {isLoading ? (
        <MovieGridSkeleton className='grid-cols-6' skeletonCount={12} />
      ) : movieHistories.length === 0 ? (
        <NoData
          className='pt-25'
          content={
            <>
              Bạn chưa xem phim nào. Hãy khám phá và xem những bộ phim yêu thích
              của bạn ngay bây giờ 😉
            </>
          }
        />
      ) : (
        <div className='grid w-full grow grid-cols-6 gap-6'>
          {movieHistories.map((movieHistory) => (
            <MovieCardHistory
              key={movieHistory.id}
              movieHistory={movieHistory}
              dir='down'
            />
          ))}
        </div>
      )}
    </div>
  );
}
