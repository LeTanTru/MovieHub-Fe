'use client';

import { List } from '@/components/list';
import { NotificationResType } from '@/types';
import { useUpdateReadNotificationMutation } from '@/queries';
import { NoData } from '@/components/no-data';
import { invalidateQueries } from '@/utils';
import { queryKeys } from '@/constants';
import { NotificationItem } from '@/components/app/notification';
import { useAuth } from '@/hooks';

type Props = {
  notificationList: NotificationResType[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onItemClick?: () => void;
};

export function NotificationList({
  notificationList,
  loading,
  onDelete,
  onItemClick
}: Props) {
  const { isAuthenticated } = useAuth();

  const { mutate: updateReadNotificationMutate } =
    useUpdateReadNotificationMutation();

  const handleUpdateRead = (notification: NotificationResType) => {
    if (!isAuthenticated) return;

    if (notification.isRead) return;

    updateReadNotificationMutate(
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
          onUpdateRead={handleUpdateRead}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
