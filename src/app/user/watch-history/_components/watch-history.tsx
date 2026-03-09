'use client';

import { MovieHistoryCard } from '@/components/app/movie-card';
import { MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { getQueryClient } from '@/components/providers';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import {
  useMovieHistoryListQuery,
  useDeleteWatchHistoryMutation
} from '@/queries';
import { notify } from '@/utils';

export default function WatchHistory() {
  const queryClient = getQueryClient();
  const { data: movieHistoriesData, isLoading } = useMovieHistoryListQuery({
    enabled: true
  });
  const movieHistories = movieHistoriesData?.data || [];

  const { mutateAsync: deleteWatchHistoryMutate } =
    useDeleteWatchHistoryMutation();

  const handleDeleteWatchHistory = async (movieId: string) => {
    await deleteWatchHistoryMutate(movieId, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Xóa lịch sử xem thành công');
          await queryClient.invalidateQueries({
            queryKey: [queryKeys.MOVIE_HISTORY]
          });
        } else {
          notify.error('Xóa lịch sử xem thất bại');
        }
      },
      onError: (error) => {
        logger.error(`Error while deleting watch history`, error);
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    });
  };

  return (
    <div className='mb-8 flex flex-col items-start justify-between gap-4'>
      <h3 className='max-640:text-base text-xl leading-normal font-semibold text-white'>
        Xem tiếp
      </h3>
      {isLoading ? (
        <MovieGridSkeleton
          className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-640:gap-y-6 max-480:gap-y-4 grid w-full grow grid-cols-6 gap-6'
          skeletonCount={12}
        />
      ) : movieHistories.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Bạn chưa xem phim nào. Hãy khám phá và xem những bộ phim yêu thích
              của bạn ngay bây giờ 😉
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
