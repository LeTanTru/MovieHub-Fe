'use client';

import NotificationList from './notification-list';
import { Button } from '@/components/form';
import { CircleLoading } from '@/components/loading';
import { ConfirmModal } from '@/components/modal';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DEFAULT_PAGE_START,
  NOTIFICATION_PAGE_SIZE,
  NOTIFICATION_TYPE_COMMUNITY,
  NOTIFICATION_TYPE_MOVIE,
  notificationTabs,
  queryKeys,
  storageKeys
} from '@/constants';
import { useAuth, useClickOutside, useDisclosure } from '@/hooks';
import { logger } from '@/logger';
import {
  useCountUnreadNotificationQuery,
  useDeleteAllNotificationMutation,
  useDeleteNotificationMutation,
  useNotificationListQuery,
  useReadAllNotificationMutation
} from '@/queries';
import { route } from '@/routes';
import { NotificationSearchType } from '@/types';
import { getData, invalidateQueries, notify, setData } from '@/utils';
import { AnimatePresence, m } from 'framer-motion';
import { Bell, CheckCheck, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DropdownNotification() {
  const { isAuthenticated } = useAuth();

  const {
    opened: openedDropdown,
    toggle: toggleDropDown,
    close: closeDropDown
  } = useDisclosure();

  const dropdownRef = useClickOutside<HTMLDivElement>(() => closeDropDown());

  const [params, setParams] = useState<NotificationSearchType>({
    type: getData(storageKeys.NOTIFICATION_TAB) || NOTIFICATION_TYPE_MOVIE,
    page: DEFAULT_PAGE_START,
    size: NOTIFICATION_PAGE_SIZE
  });

  const { data: notificationListData, isLoading } = useNotificationListQuery({
    params,
    enabled: isAuthenticated && openedDropdown
  });

  const notificationList = notificationListData?.content || [];
  const totalElements = notificationListData?.totalElements || 0;

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

  const handleReadAll = async () => {
    await readAllNotificationMutate(undefined, {
      onSuccess: () => {
        invalidateQueries([
          queryKeys.UNREAD_NOTIFICATION_COUNT,
          queryKeys.NOTIFICATION_LIST
        ]);
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
        invalidateQueries([
          queryKeys.UNREAD_NOTIFICATION_COUNT,
          queryKeys.NOTIFICATION_LIST
        ]);
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
        invalidateQueries([
          queryKeys.UNREAD_NOTIFICATION_COUNT,
          queryKeys.NOTIFICATION_LIST
        ]);
        notify.success('Xóa thông báo thành công');
      },
      onError: (error) => {
        logger.error('[DELETE_NOTIFICATION_ERROR]', error);
        notify.error('Xóa thông báo thất bại');
      }
    });
  };

  const handleChangeTab = (type: string) => {
    setParams((prev) => ({ ...prev, type: Number(type) }));
    setData(storageKeys.NOTIFICATION_TAB, String(type));
  };

  const handleItemClick = () => {
    closeDropDown();
  };

  return (
    <div ref={dropdownRef} className='relative'>
      <Button
        variant='outline'
        className='group h-11 w-11 rounded-full border-transparent p-0! text-white hover:border-transparent focus-visible:ring-0'
        onClick={toggleDropDown}
      >
        <div className='relative transition-all duration-200 ease-linear hover:opacity-80'>
          <Bell className='size-8' />
          <div className='absolute -top-1 right-0 flex size-4 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-medium text-white select-none'>
            {totalUnread > 9 ? '9+' : totalUnread}
          </div>
        </div>
      </Button>
      <AnimatePresence>
        {openedDropdown && (
          <m.div
            initial={{
              opacity: 0,
              scale: 0.5,
              transformOrigin: '91% -15px'
            }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.1,
              ease: 'linear'
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className='bg-charade absolute top-[calc(100%+8px)] -right-8 mt-2 flex max-h-[80dvh] min-h-50 w-150 flex-col justify-between rounded shadow-[0px_0px_6px_2px_var(--accent)] before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
          >
            <div className='absolute -top-2 right-11.5 h-2 w-4'>
              <div className='bg-charade h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
            </div>
            <Tabs
              defaultValue={
                getData(storageKeys.NOTIFICATION_TAB) ||
                String(NOTIFICATION_TYPE_MOVIE)
              }
              className='flex-1 rounded'
              onValueChange={handleChangeTab}
            >
              <div className='flex justify-between border-b'>
                <div className='flex-1'>
                  <TabsList className='w-full justify-start gap-0 rounded-none border-none bg-transparent p-0'>
                    {notificationTabs.map((notification) => (
                      <TabsTrigger
                        key={notification.value}
                        value={notification.value.toString()}
                        className='data-[state=active]:text-golden-glow! inline-block h-full flex-0 cursor-pointer rounded border-0 border-r border-none! border-transparent transition-all duration-200 ease-linear data-[state=active]:bg-black/20! data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                      >
                        {notification.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                {notificationList.length > 0 && !isLoading && (
                  <div className='flex items-center gap-4 pr-2'>
                    {totalUnread > 0 && (
                      <Button
                        type='button'
                        variant='ghost'
                        onClick={handleReadAll}
                        disabled={readAllNotificationLoading}
                        className='hover:text-golden-glow flex h-fit cursor-pointer items-center gap-1 p-0! transition-all duration-200 ease-linear hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {readAllNotificationLoading ? (
                          <CircleLoading className='stroke-main-color size-4' />
                        ) : (
                          <CheckCheck className='size-4' />
                        )}
                        Đọc tất cả
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
                            className='flex h-fit cursor-pointer items-center gap-1 p-0! transition-all duration-200 ease-linear hover:bg-transparent hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            {deleteAllNotificationLoading ? (
                              <CircleLoading className='stroke-main-color size-4' />
                            ) : (
                              <Trash className='size-4' />
                            )}
                            Xóa tất cả
                          </Button>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
              <TabsContent
                value={NOTIFICATION_TYPE_MOVIE.toString()}
                className='flex items-center justify-center'
              >
                <NotificationList
                  notificationList={notificationList}
                  loading={isLoading}
                  onDelete={handleDelete}
                  onItemClick={handleItemClick}
                />
              </TabsContent>
              <TabsContent
                value={NOTIFICATION_TYPE_COMMUNITY.toString()}
                className='flex items-center justify-center'
              >
                <NotificationList
                  notificationList={notificationList}
                  loading={isLoading}
                  onDelete={handleDelete}
                  onItemClick={handleItemClick}
                />
              </TabsContent>
            </Tabs>
            {notificationList.length > 0 && (
              <>
                <Separator />
                <Link
                  className='hover:text-golden-glow mt-auto block w-full rounded-br rounded-bl px-4 py-2 text-center text-slate-400 transition-all duration-500 ease-linear hover:bg-black/10'
                  href={route.user.notification.path}
                >
                  Xem tất cả
                </Link>
              </>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
