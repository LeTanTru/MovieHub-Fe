'use client';

import { invalidateQueries, notify } from '@/utils';
import { logger } from '@/logger';
import { queryKeys } from '@/constants';
import { useAuth } from './use-auth';
import { useDeleteWatchHistoryMutation } from '@/queries';

export const useWatchHistoryDelete = () => {
  const { isAuthenticated } = useAuth();

  const { mutate: deleteWatchHistory } = useDeleteWatchHistoryMutation();

  const handleDeleteWatchHistory = (movieId: string) => {
    if (!isAuthenticated) return;

    deleteWatchHistory(movieId, {
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
