'use client';

import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useDeleteWatchHistoryMutation } from '@/queries';
import { invalidateQueries, notify } from '@/utils';
import { useAuth } from './use-auth';

export const useWatchHistoryDelete = () => {
  const { isAuthenticated } = useAuth();

  const { mutateAsync: deleteWatchHistoryMutate } =
    useDeleteWatchHistoryMutation();

  const handleDeleteWatchHistory = async (movieId: string) => {
    if (!isAuthenticated) return;

    await deleteWatchHistoryMutate(movieId, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Xóa lịch sử xem thành công');
          invalidateQueries([queryKeys.MOVIE_HISTORY]);
        } else {
          notify.error('Xóa lịch sử xem thất bại');
        }
      },
      onError: (error) => {
        logger.error('[DELETE_WATCH_HISTORY_ERROR]', error);
        notify.error('Xóa lịch sử xem thất bại');
      }
    });
  };

  return { handleDeleteWatchHistory };
};
