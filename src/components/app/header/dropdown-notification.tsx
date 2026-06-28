'use client';

import { notificationApiRequest } from '@/api-requests';
import { NotificationList } from './notification-list';
import { Button } from '@/components/form';
import { CircleLoading } from '@/components/loading';
import { ConfirmModal } from '@/components/modal';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DEFAULT_PAGE_START,
  NOTIFICATION_PAGE_SIZE,
  NOTIFICATION_TYPE_MOVIE,
  apiConfig,
  notificationTabs,
  queryKeys
} from '@/constants';
import {
  useAuth,
  useClickOutside,
  useDisclosure,
  useLoadMore,
  useNotificationActions,
  useValidatePermission
} from '@/hooks';
import { useCountUnreadNotificationQuery } from '@/queries';
import { route } from '@/routes';
import { NotificationResType, NotificationSearchType } from '@/types';
import { AnimatePresence, domMax, LazyMotion, m } from 'framer-motion';
import { Bell, CheckCheck, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function DropdownNotification() {
  const { isAuthenticated } = useAuth();
  const hasPermission = useValidatePermission();

  const canListNotification =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.notification.getList.permissionCode]
    });

  const {
    opened: openedDropdown,
    toggle: toggleDropDown,
    close: closeDropDown
  } = useDisclosure();

  const dropdownRef = useClickOutside<HTMLDivElement>(() => closeDropDown());

  const [params, setParams] = useState<NotificationSearchType>({
    type: String(NOTIFICATION_TYPE_MOVIE),
    page: DEFAULT_PAGE_START,
    size: NOTIFICATION_PAGE_SIZE
  });

  const {
    data: notificationList,
    isLoading,
    totalElements
  } = useLoadMore<HTMLDivElement, NotificationSearchType, NotificationResType>({
    queryKey: queryKeys.NOTIFICATION_LIST,
    params,
    queryFn: notificationApiRequest.getList,
    enabled: canListNotification,
    mode: 'click'
  });

  const { data: totalUnreadData } = useCountUnreadNotificationQuery({
    enabled: canListNotification
  });

  const totalUnread = totalUnreadData?.totalUnread
    ? Number(totalUnreadData.totalUnread)
    : 0;

  const {
    handleReadAll,
    handleDeleteAll,
    handleDelete,
    canUpdateNotification,
    canDeleteNotification,
    readAllNotificationLoading,
    deleteAllNotificationLoading
  } = useNotificationActions();

  const handleChangeTab = (type: string) => {
    setParams((prev) => ({ ...prev, type }));
  };

  const handleItemClick = () => {
    closeDropDown();
  };

  if (!canListNotification) return null;

  return (
    <div ref={dropdownRef} className='relative'>
      <Button
        variant='outline'
        className='group size-11 rounded-full border-transparent p-0! text-white hover:border-transparent focus-visible:ring-0'
        onClick={toggleDropDown}
      >
        <div className='relative transition-all duration-200 ease-linear hover:opacity-80'>
          <Bell className='size-8' />
          <div className='absolute -top-1 right-0 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white select-none'>
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
            className='bg-charade absolute top-[calc(100%+8px)] -right-8 mt-2 flex w-150 flex-col justify-between rounded before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
          >
            <div className='absolute -top-2 right-11.5 h-2 w-4'>
              <div className='bg-charade size-4 rotate-45' />
            </div>
            <Tabs
              defaultValue={String(NOTIFICATION_TYPE_MOVIE)}
              className='flex-1 gap-0 overflow-hidden rounded'
              onValueChange={handleChangeTab}
            >
              <div className='flex justify-between border-b'>
                <div className='flex-1'>
                  <TabsList className='relative flex w-fit justify-start gap-0 rounded-none border-none bg-transparent p-0 pl-1'>
                    {notificationTabs.map((notification) => {
                      const isActive =
                        params.type.toString() ===
                        notification.value.toString();

                      return (
                        <div
                          key={notification.value}
                          className='relative flex h-full items-center'
                        >
                          <LazyMotion features={domMax}>
                            {isActive && (
                              <m.div
                                layoutId='notification-tab-bg'
                                className='bg-black-denim absolute inset-0 top-1/2 h-7 -translate-y-1/2 rounded-full'
                                transition={{ duration: 0.1, ease: 'linear' }}
                              />
                            )}
                          </LazyMotion>
                          <TabsTrigger
                            value={notification.value.toString()}
                            className='dark:data-[state=active]:text-golden-glow dark:data-[state=inactive]:hover:text-golden-glow relative z-10 inline-block min-w-20 flex-0 cursor-pointer rounded-full border-0 border-none! border-transparent bg-transparent! transition-all duration-200 ease-linear data-[state=active]:shadow-none'
                          >
                            {notification.label}
                          </TabsTrigger>
                        </div>
                      );
                    })}
                  </TabsList>
                </div>
                {notificationList.length > 0 && !isLoading && (
                  <div className='flex items-center gap-4 pr-2'>
                    {canUpdateNotification && totalUnread > 0 && (
                      <Button
                        type='button'
                        variant='ghost'
                        onClick={handleReadAll}
                        disabled={readAllNotificationLoading}
                        className='hover:text-golden-glow flex h-fit cursor-pointer items-center gap-1 p-0! transition-all duration-200 ease-linear hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {readAllNotificationLoading ? (
                          <CircleLoading className='stroke-light-gray size-4' />
                        ) : (
                          <CheckCheck className='size-4' />
                        )}
                        Đọc tất cả
                      </Button>
                    )}
                    {canDeleteNotification && totalElements > 0 && (
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
                              <CircleLoading className='stroke-light-gray size-4' />
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
              {notificationTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value.toString()}>
                  <NotificationList
                    notificationList={notificationList}
                    loading={isLoading}
                    canDelete={canDeleteNotification}
                    onDelete={handleDelete}
                    onItemClick={handleItemClick}
                  />
                </TabsContent>
              ))}
            </Tabs>
            <>
              <Separator />
              <Link
                className='hover:text-golden-glow mt-auto block w-full rounded-br rounded-bl px-4 py-2 text-center text-slate-400 transition-all duration-500 ease-linear hover:bg-black/10'
                href={route.user.notification.path}
              >
                Xem tất cả
              </Link>
            </>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
