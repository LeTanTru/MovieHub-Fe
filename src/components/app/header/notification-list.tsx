'use client';

import { List } from '@/components/list';
import type { NotificationResType } from '@/types';
import { useUpdateReadNotificationMutation } from '@/queries';
import { NoData } from '@/components/no-data';
import { invalidateQueries } from '@/utils';
import { apiConfig, queryKeys } from '@/constants';
import { NotificationItem } from '@/components/app/notification';
import { useAuth, useValidatePermission } from '@/hooks';

type Props = {
  notificationList: NotificationResType[];
  loading?: boolean;
  canDelete?: boolean;
  onDelete: (id: string) => void;
  onItemClick?: () => void;
};

export function NotificationList({
  notificationList,
  loading,
  canDelete = true,
  onDelete,
  onItemClick
}: Props) {
  const { isAuthenticated } = useAuth();
  const hasPermission = useValidatePermission();

  const canUpdateNotification =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.notification.updateRead.permissionCode]
    });

  const { mutate: updateReadNotification } =
    useUpdateReadNotificationMutation();

  const handleUpdateRead = (notification: NotificationResType) => {
    if (!isAuthenticated || !canUpdateNotification) return;

    if (notification.isRead) return;

    updateReadNotification(
      { ids: [notification.id] },
      {
        onSuccess: () => {
          invalidateQueries(
            [queryKeys.UNREAD_NOTIFICATION_COUNT],
            [queryKeys.NOTIFICATION_LIST]
          );
          onItemClick?.();
        }
      }
    );
  };

  if (loading) {
    return (
      <List className='scrollbar-none flex h-[80vh] flex-col overflow-hidden'>
        {Array.from({ length: 8 }).map((_, index) => (
          <NotificationItem.Skeleton key={`header-notification-${index}`} />
        ))}
      </List>
    );
  }

  if (!notificationList.length) {
    return (
      <NoData
        className='h-[80vh] pt-0'
        width={120}
        content='Không có thông báo nào'
      />
    );
  }

  return (
    <List className='scrollbar-none flex h-[80vh] flex-col overflow-y-auto'>
      {notificationList.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          canDelete={canDelete}
          onUpdateRead={handleUpdateRead}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
