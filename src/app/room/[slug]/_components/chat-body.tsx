'use client';

import { MessageEmptyIcon } from '@/assets';
import { Skeleton } from '@/components/ui/skeleton';
import { ROOM_STATE_ENDED, ROOM_STATE_RUNNING } from '@/constants';
import { useRoomStore } from '@/store';

const CHAT_SKELETON_COUNT = 10;

export function ChatBody() {
  const room = useRoomStore((state) => state.room);

  if (!room) return <ChatBody.Skeleton />;

  const isRunning = room.state === ROOM_STATE_RUNNING;
  const isEnd = room.state === ROOM_STATE_ENDED;

  return (
    <div className='relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl px-4 py-12'>
      <MessageEmptyIcon iconClassName='size-16' />
      <p className='text-center text-gray-300'>
        {isRunning ? (
          <>
            Chưa có tin nhắn nào trong phòng này. <br /> Hãy gửi tin nhắn đầu
            tiên để bắt đầu cuộc trò chuyện nhé !
          </>
        ) : isEnd ? (
          <>Phòng này đã kết thúc.</>
        ) : (
          <>
            Phòng chat đang chờ. <br /> Vui lòng mở phòng chat để gửi tin nhắn.
          </>
        )}
      </p>
    </div>
  );
}

ChatBody.Skeleton = function ChatBodySkeleton() {
  return (
    <div className='relative flex flex-1 flex-col justify-end gap-4 overflow-hidden px-4 py-4'>
      {Array.from({ length: CHAT_SKELETON_COUNT }).map((_, index) => (
        <div key={index} className='flex w-full items-end gap-2'>
          <Skeleton className='bg-transparent-black-8 skeleton size-8 shrink-0 rounded-full!' />
          <Skeleton className='bg-transparent-black-8 skeleton h-10 w-full rounded-2xl! rounded-bl-sm!' />
        </div>
      ))}
    </div>
  );
};
