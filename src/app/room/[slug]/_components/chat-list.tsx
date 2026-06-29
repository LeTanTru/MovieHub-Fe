'use client';

import { MessageEmptyIcon } from '@/assets';
import { Skeleton } from '@/components/ui/skeleton';

export function ChatBody() {
  return (
    <div className='relative flex grow flex-col justify-between gap-1 overflow-hidden'>
      <div className='flex flex-col items-center justify-center gap-4 rounded-2xl px-4 py-12'>
        <MessageEmptyIcon iconClassName='size-16' />
        <p className='text-center text-gray-300'>
          Chưa có tin nhắn nào trong phòng chat này. <br /> Hãy gửi tin nhắn đầu
          tiên để bắt đầu cuộc trò chuyện nhé !
        </p>
      </div>
    </div>
  );
}

ChatBody.Skeleton = function ChatBodySkeleton() {
  return (
    <div className='relative flex grow flex-col justify-end gap-4 overflow-hidden px-4 py-4'>
      <div className='flex w-full items-end gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton size-8 shrink-0 rounded-full!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-10 w-2/3 rounded-2xl rounded-bl-sm!' />
      </div>
      <div className='flex w-full items-end justify-end gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton h-10 w-1/2 rounded-2xl rounded-br-sm!' />
      </div>
      <div className='flex w-full items-end gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton size-8 shrink-0 rounded-full!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-16 w-3/4 rounded-2xl rounded-bl-sm!' />
      </div>
    </div>
  );
};
