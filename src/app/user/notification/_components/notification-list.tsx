'use client';

import { notificationApiRequest } from '@/api-requests';
import { NotificationItem } from '@/components/app/notification';
import { Button } from '@/components/form';
import { List } from '@/components/list';
import { CircleLoading, VerticalBarLoading } from '@/components/loading';
import { ConfirmModal } from '@/components/modal';
import {
  DEFAULT_PAGE_START,
  NOTIFICATION_PAGE_SIZE,
  NOTIFICATION_TYPE_MOVIE,
  notificationTabs,
  queryKeys
} from '@/constants';
import { useAuth, useLoadMore } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import {
  useCountUnreadNotificationQuery,
  useDeleteAllNotificationMutation,
  useDeleteNotificationMutation,
  useReadAllNotificationMutation,
  useUpdateReadNotificationMutation
} from '@/queries';
import { NotificationResType, NotificationSearchType } from '@/types';
import { invalidateQueries, notify } from '@/utils';
import { CheckCheck, Trash } from 'lucide-react';
import { useState } from 'react';

export function NotificationList() {
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(NOTIFICATION_TYPE_MOVIE);

  const [params, setParams] = useState<NotificationSearchType>({
    type: NOTIFICATION_TYPE_MOVIE,
    page: DEFAULT_PAGE_START,
    size: NOTIFICATION_PAGE_SIZE
  });

  const {
    data: notificationList,
    isLoading,
    totalElements,
    hasMore,
    isLoadingMore,
    remainingElements,
    handleLoadMore
  } = useLoadMore<HTMLDivElement, NotificationSearchType, NotificationResType>({
    queryKey: queryKeys.NOTIFICATION_LIST,
    params,
    queryFn: notificationApiRequest.getList,
    enabled: isAuthenticated,
    mode: 'click'
  });

  const { data: totalUnreadData } = useCountUnreadNotificationQuery({
    enabled: isAuthenticated
  });

  const totalUnread = totalUnreadData?.totalUnread
    ? Number(totalUnreadData.totalUnread)
    : 0;

  const {
    mutateAsync: readAllNotificationMutate,
    isPending: readAllNotificationLoading
  } = useReadAllNotificationMutation();

  const { mutateAsync: deleteNotifyMutate } = useDeleteNotificationMutation();

  const {
    mutateAsync: deleteAllNotificationMutate,
    isPending: deleteAllNotificationLoading
  } = useDeleteAllNotificationMutation();

  const { mutateAsync: updateReadNotificationMutate } =
    useUpdateReadNotificationMutation();

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

  const handleUpdateRead = async (notification: NotificationResType) => {
    if (notification.isRead) return;

    await updateReadNotificationMutate(
      { ids: [notification.id] },
      {
        onSuccess: () => {
          invalidateQueries(
            [queryKeys.UNREAD_NOTIFICATION_COUNT],
            [queryKeys.NOTIFICATION_LIST]
          );
        },
        onError: (error) => {
          logger.error('[UPDATE_READ_NOTIFICATION_ERROR]', error);
        }
      }
    );
  };

  const handleChangeTab = (type: number) => {
    setParams((prev) => ({ ...prev, type: String(type) }));
    setActiveTab(type);
  };

  return (
    <div className='mb-8 flex flex-col items-start justify-between gap-4'>
      <h3 className='max-640:text-base text-xl leading-normal font-semibold text-white'>
        Thông báo ({totalUnread} chưa đọc)
      </h3>
      <div className='max-640:flex-col max-640:gap-3 flex w-full items-center justify-between gap-4'>
        <div className='flex flex-wrap gap-2' role='tablist'>
          {notificationTabs.map((tab) => (
            <Button
              key={tab.value}
              className={cn(
                'min-w-25 cursor-pointer rounded-full px-4 py-2 text-center transition-all duration-200 ease-linear hover:bg-white hover:text-black',
                {
                  'bg-white text-black': activeTab === tab.value,
                  'bg-white/5 text-white': activeTab !== tab.value
                }
              )}
              role='tab'
              id={`notification-tab-${tab.value}`}
              aria-controls={`notification-tabpanel-${tab.value}`}
              aria-selected={activeTab === tab.value}
              tabIndex={activeTab === tab.value ? 0 : -1}
              onClick={() => handleChangeTab(tab.value as number)}
              variant='default'
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          {totalUnread > 0 && (
            <Button
              className='min-w-25 cursor-pointer rounded-full px-4 py-2 text-center transition-all duration-200 ease-linear'
              variant='default'
              onClick={handleReadAll}
            >
              {readAllNotificationLoading ? (
                <CircleLoading className='size-4 stroke-black' />
              ) : (
                <CheckCheck className='size-4' />
              )}
              <span className='max-520:hidden'> Đọc tất cả</span>
            </Button>
          )}

          {totalElements > 0 && (
            <ConfirmModal
              message='Bạn có chắc chắn muốn xóa tất cả không báo không?'
              onConfirm={handleDeleteAll}
              trigger={
                <Button
                  type='button'
                  variant='ghost'
                  disabled={deleteAllNotificationLoading}
                  className='min-w-25 cursor-pointer rounded-full bg-rose-500/80 px-4 py-2 text-center transition-all duration-200 ease-linear hover:bg-rose-500'
                >
                  {deleteAllNotificationLoading ? (
                    <CircleLoading className='stroke-main-color size-4' />
                  ) : (
                    <Trash className='size-4' />
                  )}
                  <span className='max-520:hidden'> Xóa tất cả</span>
                </Button>
              }
            />
          )}
        </div>
      </div>
      {isLoading ? (
        <div className='flex min-h-[50vh] w-full items-center justify-center'>
          <VerticalBarLoading className='stroke-main-color' />
        </div>
      ) : (
        <List className='w-full'>
          {notificationList.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onUpdateRead={handleUpdateRead}
              onDelete={handleDelete}
            />
          ))}
        </List>
      )}
      {hasMore && (
        <div className='flex w-full items-center justify-center'>
          {isLoadingMore ? (
            <VerticalBarLoading className='py-10' />
          ) : (
            <Button
              className='hover:text-golden-glow hover:bg-transparent'
              variant='ghost'
              onClick={handleLoadMore}
            >
              {remainingElements > 0 &&
                `Xem thêm (${remainingElements}) thông báo`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
