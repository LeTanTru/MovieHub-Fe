'use client';

import { Button } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import NotificationBody from './notification-body';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib';
import { NotificationResType } from '@/types';
import { EllipsisVertical } from 'lucide-react';
import { AiOutlineDelete } from 'react-icons/ai';

type NotificationItemProps = {
  notification: NotificationResType;
  onUpdateRead: (notification: NotificationResType) => Promise<void>;
  onDelete: (id: string) => void;
};

export default function NotificationItem({
  notification,
  onUpdateRead,
  onDelete
}: NotificationItemProps) {
  return (
    <div
      onClick={() => onUpdateRead(notification)}
      className={cn(
        'hover:bg-bunker/80 flex cursor-pointer items-center justify-between rounded py-2 transition-colors duration-200 ease-linear',
        {
          'bg-bunker/50': !notification.isRead
        }
      )}
    >
      <NotificationBody notification={notification} />

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
    </div>
  );
}
