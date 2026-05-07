'use client';

import { List } from '@/components/list';
import { NotificationResType } from '@/types';
import { useUpdateReadNotificationMutation } from '@/queries';
import { NoData } from '@/components/no-data';
import { invalidateQueries } from '@/utils';
import { queryKeys } from '@/constants';
import { NotificationItem } from '@/components/app/notification';
import { VerticalBarLoading } from '@/components/loading';

type Props = {
  notificationList: NotificationResType[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onItemClick?: () => void;
};

export default function NotificationList({
  notificationList,
  loading,
  onDelete,
  onItemClick
}: Props) {
  const { mutateAsync: updateReadNotificationMutate } =
    useUpdateReadNotificationMutation();

  const handleUpdateRead = async (notification: NotificationResType) => {
    if (notification.isRead) return;

    await updateReadNotificationMutate(
      { ids: [notification.id] },
      {
        onSuccess: () => {
          invalidateQueries([
            queryKeys.UNREAD_NOTIFICATION_COUNT,
            queryKeys.NOTIFICATION_LIST
          ]);
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
    <List className='scrollbar-none flex max-h-[80vh] min-h-[50vh] w-full flex-col overflow-y-auto rounded p-1'>
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
