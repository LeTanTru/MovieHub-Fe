'use client';

import { apiConfig, queryKeys } from '@/constants';
import { useValidatePermission } from '@/hooks/use-validate-permission';
import { logger } from '@/logger';
import {
  useDeleteAllNotificationMutation,
  useDeleteNotificationMutation,
  useReadAllNotificationMutation
} from '@/queries';
import { invalidateQueries, notify } from '@/utils';

export const useNotificationActions = () => {
  const hasPermission = useValidatePermission();

  const canUpdateNotification = hasPermission({
    requiredPermissions: [apiConfig.notification.updateRead.permissionCode]
  });
  const canDeleteNotification = hasPermission({
    requiredPermissions: [apiConfig.notification.delete.permissionCode]
  });

  const { mutate: readAllNotification, isPending: readAllNotificationLoading } =
    useReadAllNotificationMutation();

  const {
    mutate: deleteAllNotification,
    isPending: deleteAllNotificationLoading
  } = useDeleteAllNotificationMutation();

  const { mutate: deleteNotify } = useDeleteNotificationMutation();

  const handleReadAll = () => {
    readAllNotification(undefined, {
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

  const handleDeleteAll = () => {
    deleteAllNotification(undefined, {
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

  const handleDelete = (id: string) => {
    deleteNotify(id, {
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
    canUpdateNotification,
    canDeleteNotification,
    readAllNotificationLoading,
    deleteAllNotificationLoading
  };
};
