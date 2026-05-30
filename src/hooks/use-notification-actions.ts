'use client';

import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import {
  useDeleteAllNotificationMutation,
  useDeleteNotificationMutation,
  useReadAllNotificationMutation
} from '@/queries';
import { invalidateQueries, notify } from '@/utils';

export const useNotificationActions = () => {
  const {
    mutateAsync: readAllNotificationMutate,
    isPending: readAllNotificationLoading
  } = useReadAllNotificationMutation();

  const {
    mutateAsync: deleteAllNotificationMutate,
    isPending: deleteAllNotificationLoading
  } = useDeleteAllNotificationMutation();

  const { mutateAsync: deleteNotifyMutate } = useDeleteNotificationMutation();

  const handleReadAll = async () => {
    await readAllNotificationMutate(undefined, {
      onSuccess: () => {
        invalidateQueries(
          [queryKeys.UNREAD_NOTIFICATION_COUNT],
          [queryKeys.NOTIFICATION_LIST]
        );
        notify.success('Đọc tất cả thông báo thành công');
      },
      onError: (error) => {
        logger.error('[READ_ALL_NOTIFICATION_ERROR]', error);
        notify.error('Đọc tất cả thông báo thất bại');
      }
    });
  };

  const handleDeleteAll = async () => {
    await deleteAllNotificationMutate(undefined, {
      onSuccess: () => {
        invalidateQueries(
          [queryKeys.UNREAD_NOTIFICATION_COUNT],
          [queryKeys.NOTIFICATION_LIST]
        );
        notify.success('Xóa tất cả thông báo thành công');
      },
      onError: (error) => {
        logger.error('[DELETE_ALL_NOTIFICATION_ERROR]', error);
        notify.error('Xóa tất cả thông báo thất bại');
      }
    });
  };

  const handleDelete = async (id: string) => {
    await deleteNotifyMutate(id, {
      onSuccess: () => {
        invalidateQueries(
          [queryKeys.UNREAD_NOTIFICATION_COUNT],
          [queryKeys.NOTIFICATION_LIST]
        );
        notify.success('Xóa thông báo thành công');
      },
      onError: (error) => {
        logger.error('[DELETE_NOTIFICATION_ERROR]', error);
        notify.error('Xóa thông báo thất bại');
      }
    });
  };

  return {
    handleReadAll,
    handleDeleteAll,
    handleDelete,
    readAllNotificationLoading,
    deleteAllNotificationLoading
  };
};
