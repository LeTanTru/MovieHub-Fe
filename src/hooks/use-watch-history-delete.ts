'use client';

import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useDeleteWatchHistoryMutation } from '@/queries';
import { invalidateQueries, notify } from '@/utils';
import { useAuth } from './use-auth';

export const useWatchHistoryDelete = () => {
  const { isAuthenticated } = useAuth();

  const { mutate: deleteWatchHistoryMutate } = useDeleteWatchHistoryMutation();

  const handleDeleteWatchHistory = (movieId: string) => {
    if (!isAuthenticated) return;

    deleteWatchHistoryMutate(movieId, {
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
