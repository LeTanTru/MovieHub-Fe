'use client';

import { MessageEmptyIcon } from '@/assets';
import { AvatarField } from '@/components/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DATE_TIME_FORMAT,
  ROOM_STATE_ENDED,
  ROOM_STATE_RUNNING,
  TIME_SHORT
} from '@/constants';
import { cn } from '@/lib';
import { useAuth } from '@/hooks';
import { useChatStore, useRoomStore } from '@/store';
import { convertUTCToLocal, formatTime, renderImageUrl } from '@/utils';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

const CHAT_SKELETON_COUNT = 10;

export function ChatBody() {
  const { profile } = useAuth();
  const { room, isJoined } = useRoomStore(
    useShallow((state) => ({ room: state.room, isJoined: state.isJoined }))
  );
  const { messages, messagesLoaded } = useChatStore(
    useShallow((state) => ({
      messages: state.messages,
      messagesLoaded: state.messagesLoaded
    }))
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!room) return <ChatBody.Skeleton />;

  const isRunning = room.state === ROOM_STATE_RUNNING;
  const isEnd = room.state === ROOM_STATE_ENDED;

  if (isJoined && isRunning && !messagesLoaded) return <ChatBody.Skeleton />;

  if (messages.length > 0) {
    return (
      <div className='relative min-h-0 flex-1 overflow-hidden'>
        <ScrollArea className='h-full px-4 py-4'>
          <div className='flex flex-col gap-4'>
            {messages.map((msg) => {
              const isOwn = msg.user.id === profile?.id;

              return (
                <div
                  key={msg.id}
                  className={cn('flex items-end gap-2', {
                    'flex-row-reverse': isOwn
                  })}
                >
                  <AvatarField
                    src={renderImageUrl(msg.user.avatarPath)}
                    size={32}
                    alt={msg.user.fullName}
                    disablePreview
                    className='shrink-0'
                  />
                  <div
                    className={cn('flex max-w-[75%] flex-col gap-1', {
                      'items-end': isOwn,
                      'items-start': !isOwn
                    })}
                  >
                    {!isOwn && (
                      <span className='px-1 text-xs text-gray-400'>
                        {msg.user.fullName}
                      </span>
                    )}
                    <div
                      className={cn(
                        'rounded-2xl px-3 py-2 text-sm wrap-break-word text-white',
                        isOwn
                          ? 'bg-golden-glow rounded-br-sm text-black'
                          : 'bg-transparent-black-8 rounded-bl-sm'
                      )}
                    >
                      {msg.content}
                    </div>
                    <span className='px-1 text-[11px] text-gray-500'>
                      {formatTime(
                        convertUTCToLocal(
                          msg.createdDate,
                          DATE_TIME_FORMAT,
                          DATE_TIME_FORMAT
                        ),
                        TIME_SHORT
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className='relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl px-4 py-12'>
      <MessageEmptyIcon iconClassName='size-16' />
      <p className='text-center text-gray-300'>
        {isRunning ? (
          <>
            {isJoined ? (
              <>
                Chưa có tin nhắn nào trong phòng này. <br /> Hãy gửi tin nhắn
                đầu tiên để bắt đầu cuộc trò chuyện nhé !
              </>
            ) : (
              <>Tham gia phòng để bắt đầu gửi tin nhắn</>
            )}
          </>
        ) : isEnd ? (
          <>Phòng này đã kết thúc.</>
        ) : (
          <>
            Phòng đang chờ để bắt đầu. <br /> Vui lòng đợi phòng bắt đầu để gửi
            tin nhắn.
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
