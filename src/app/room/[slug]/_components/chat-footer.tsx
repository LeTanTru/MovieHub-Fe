'use client';

import { FaUser } from 'react-icons/fa6';
import { useAuth } from '@/hooks';
import ChatInput from './chat-input';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoomStore } from '@/store';
import { ROOM_STATE_RUNNING } from '@/constants';

export function ChatFooter() {
  const { profile } = useAuth();
  const room = useRoomStore((state) => state.room);

  if (!room) return <ChatFooter.Skeleton />;

  const isRunning = room.state === ROOM_STATE_RUNNING;

  return (
    <div className='relative z-3 flex shrink-0 flex-col gap-3 p-4'>
      {isRunning && <ChatInput />}
      <div className='relative flex items-center gap-2'>
        <div className='inline-flex items-center gap-2'>
          <FaUser className='text-golden-glow' />
          <span>{profile?.username || profile?.fullName}</span>
        </div>
      </div>
    </div>
  );
}

ChatFooter.Skeleton = function ChatFooterSkeleton() {
  return (
    <div className='relative z-3 flex shrink-0 flex-col gap-3 p-4'>
      <div className='flex items-center gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton h-9 w-full rounded-full!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-9 w-11 rounded-md!' />
      </div>
      <div className='relative flex items-center gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton size-4 rounded-full!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-24 rounded!' />
      </div>
    </div>
  );
};
