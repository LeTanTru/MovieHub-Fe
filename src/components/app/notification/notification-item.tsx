'use client';

import { Button } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { NotificationBody } from './notification-body';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib';
import type { NotificationResType } from '@/types';
import { EllipsisVertical } from 'lucide-react';
import { AiOutlineDelete } from 'react-icons/ai';
import { ListItem } from '@/components/list';
import { Skeleton } from '@/components/ui/skeleton';

type NotificationItemProps = {
  notification: NotificationResType;
  canDelete?: boolean;
  onUpdateRead: (notification: NotificationResType) => void;
  onDelete: (id: string) => void;
};

export function NotificationItem({
  notification,
  canDelete = true,
  onUpdateRead,
  onDelete
}: NotificationItemProps) {
  return (
    <ListItem
      onClick={() => onUpdateRead(notification)}
      className={cn(
        'max-640:py-1.5 hover:bg-black-denim/60 flex cursor-pointer items-center justify-between py-2 transition-colors duration-200 ease-linear',
        {
          'bg-black-denim/50': !notification.isRead
        }
      )}
    >
      <NotificationBody notification={notification} />

      {canDelete && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            className='border-none bg-transparent shadow-none'
            asChild
          >
            <Button variant='outline' className='px-2!'>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            sideOffset={0}
            className='dark:bg-charade w-40 border-none'
            align='center'
          >
            <DropdownMenuGroup>
              <DropdownMenuItem className='dark:hover:bg-black-denim cursor-pointer p-0! transition-all duration-200 ease-linear'>
                <ConfirmModal
                  message='Bạn có chắc chắn muốn xóa thông báo này không ?'
                  onConfirm={() => onDelete(notification.id)}
                  trigger={
                    <Button
                      variant='ghost'
                      className='h-fit w-full justify-start border-none bg-transparent p-2! text-rose-500 shadow-none hover:bg-transparent hover:text-rose-500/50'
                    >
                      <AiOutlineDelete className='size-5' />
                      Xóa
                    </Button>
                  }
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ListItem>
  );
}

NotificationItem.Skeleton = function NotificationItemSkeleton() {
  return (
    <ListItem className='max-640:py-1.5 flex items-center justify-between py-2'>
      <div className='max-480:flex-col max-480:items-start max-480:gap-2 flex flex-1 items-center justify-between gap-2 pl-1'>
        <div className='flex flex-1 items-center gap-2'>
          <Skeleton className='skeleton max-640:size-8 max-520:size-7 size-10 shrink-0 rounded-full!' />
          <div className='flex flex-1 flex-col justify-between gap-2'>
            <Skeleton className='skeleton h-4 w-11/12 rounded' />
            <Skeleton className='skeleton h-4 w-2/3 rounded' />
            <Skeleton className='skeleton h-3 w-24 rounded' />
          </div>
        </div>
        <Skeleton className='skeleton max-480:hidden aspect-video w-20 shrink-0 rounded-sm!' />
      </div>
      <Skeleton className='skeleton mx-2 size-8 shrink-0 rounded' />
    </ListItem>
  );
};

NotificationItem.MovieSkeleton = function () {
  return (
    <ListItem className='max-640:py-1.5 flex items-center justify-between py-2'>
      <div className='max-480:flex-col max-480:items-start max-480:gap-2 flex flex-1 items-center justify-between gap-2 pl-1'>
        <div className='max-480:hidden relative aspect-video h-11.25 w-20 shrink-0'>
          <Skeleton className='skeleton h-full w-full rounded-sm!' />
        </div>
        <div className='flex flex-1 flex-col justify-between gap-2'>
          <Skeleton className='skeleton h-4 w-11/12 rounded' />
          <Skeleton className='skeleton h-4 w-2/3 rounded' />
          <Skeleton className='skeleton h-3 w-24 rounded' />
        </div>
      </div>
      <Skeleton className='skeleton mx-2 h-9 w-8 shrink-0 rounded' />
    </ListItem>
  );
};

NotificationItem.CommunitySkeleton = function () {
  return (
    <ListItem className='max-640:py-1.5 flex items-center justify-between py-2'>
      <div className='max-480:flex-col max-480:items-start max-480:gap-2 flex flex-1 items-center justify-between gap-2 pl-1'>
        <div className='flex flex-1 items-center gap-2'>
          <Skeleton className='skeleton max-640:size-8 max-520:size-7 size-10 shrink-0 rounded-full!' />
          <div className='flex flex-1 flex-col justify-between gap-2'>
            <Skeleton className='skeleton h-4 w-11/12 rounded' />
            <Skeleton className='skeleton h-3 w-24 rounded' />
          </div>
        </div>
        <Skeleton className='skeleton max-480:hidden aspect-video h-11.25 w-20 shrink-0 rounded-sm!' />
      </div>
      <Skeleton className='skeleton mx-2 h-9 w-8 shrink-0 rounded' />
    </ListItem>
  );
};
