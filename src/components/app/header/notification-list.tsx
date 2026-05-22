'use client';

import { List } from '@/components/list';
import { NotificationResType } from '@/types';
import { useUpdateReadNotificationMutation } from '@/queries';
import { NoData } from '@/components/no-data';
import { invalidateQueries } from '@/utils';
import { queryKeys } from '@/constants';
import { NotificationItem } from '@/components/app/notification';
import { VerticalBarLoading } from '@/components/loading';
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

  const { mutateAsync: updateReadNotificationMutate } =
    useUpdateReadNotificationMutation();

  const handleUpdateRead = async (notification: NotificationResType) => {
    if (!isAuthenticated) return;

    if (notification.isRead) return;

    await updateReadNotificationMutate(
      { ids: [notification.id] },
      {
        onSuccess: () => {
          invalidateQueries(
            [queryKeys.UNREAD_NOTIFICATION_COUNT],
            [queryKeys.NOTIFICATION_LIST]
          );
        }
      }
    );

    onItemClick?.();
  };

  if (loading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <VerticalBarLoading className='stroke-main-color' />
      </div>
    );
  }

  if (!notificationList.length) {
    return (
      <NoData
        className='min-h-[50vh] pt-0'
        width={120}
        content='Không có thông báo nào'
      />
    );
  }

  return (
    <List className='scrollbar-none block h-full overflow-y-auto'>
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
