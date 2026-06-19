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
import { useAuth, useLoadMore, useNotificationActions } from '@/hooks';
import {
  useCountUnreadNotificationQuery,
  useUpdateReadNotificationMutation
} from '@/queries';
import { NotificationResType, NotificationSearchType } from '@/types';
import { invalidateQueries } from '@/utils';
import { logger } from '@/logger';
import { CheckCheck, Trash } from 'lucide-react';
import { useState } from 'react';
import { ButtonAction } from '@/components/app/button-action';

export function NotificationList() {
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(String(NOTIFICATION_TYPE_MOVIE));

  const [params, setParams] = useState<NotificationSearchType>({
    type: String(NOTIFICATION_TYPE_MOVIE),
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

  const { mutate: updateReadNotificationMutate } =
    useUpdateReadNotificationMutation();

  const {
    handleReadAll,
    handleDeleteAll,
    handleDelete,
    readAllNotificationLoading,
    deleteAllNotificationLoading
  } = useNotificationActions();

  const handleUpdateRead = (notification: NotificationResType) => {
    if (notification.isRead) return;

    updateReadNotificationMutate(
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

  const handleChangeTab = (type: string) => {
    setParams((prev) => ({ ...prev, page: DEFAULT_PAGE_START, type }));
    setActiveTab(type);
  };

  return (
    <div className='mb-8 flex flex-col items-start justify-between gap-4'>
      <h3 className='max-640:text-base text-xl leading-normal font-semibold text-white'>
        Thông báo ({totalUnread} chưa đọc)
      </h3>
      <div className='max-640:flex-col max-640:gap-3 flex w-full items-center justify-between gap-4'>
        <div className='flex flex-wrap gap-2' role='tablist'>
          <div className='relative flex shrink-0 items-stretch'>
            {notificationTabs.map((action) => (
              <ButtonAction
                key={action.value}
                label={action.label}
                action={String(action.value)}
                activeTab={activeTab}
                setActiveTab={handleChangeTab}
                className='max-640:text-[13px] max-480:text-xs max-640:py-1 max-640:px-1.5'
              />
            ))}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {totalUnread > 0 && (
            <Button
              className='h-7 min-w-20 cursor-pointer rounded-full px-4 py-2 text-center transition-all duration-200 ease-linear'
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
                  className='h-7 min-w-20 cursor-pointer rounded-full bg-rose-500/80 px-4 py-2 text-center transition-all duration-200 ease-linear hover:bg-rose-500'
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
        <List className='w-full'>
          {Array.from({ length: 6 }).map((_, index) => (
            <NotificationItem.Skeleton key={`notification-skeleton-${index}`} />
          ))}
        </List>
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
