'use client';

import { ChatBody } from './chat-body';
import { ChatFooter } from './chat-footer';
import { ChatHeader } from './chat-header';
import { cn } from '@/lib';
import { useChatStore, useRoomStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function Chat() {
  const room = useRoomStore((state) => state.room);
  const { toggleChat, toggleChatLayout } = useChatStore(
    useShallow((state) => ({
      toggleChat: state.toggleChat,
      toggleChatLayout: state.toggleChatLayout
    }))
  );

  if (!room) return <Chat.Skeleton />;

  return (
    <div
      className={cn(
        'h-full shrink-0 overflow-hidden transition-all duration-100 ease-in-out',
        {
          'w-0 translate-x-full opacity-0': toggleChat,
          'w-100 translate-x-0 opacity-100': !toggleChat,
          'py-2 pr-2': !toggleChatLayout
        }
      )}
    >
      <div
        className={cn('z-9 flex h-full flex-col', {
          'bg-eerie-black rounded-2xl': !toggleChatLayout,
          'bg-transparent-black-8': toggleChatLayout
        })}
      >
        <ChatHeader />
        <ChatBody />
        <ChatFooter />
      </div>
    </div>
  );
}

Chat.Skeleton = function ChatSkeleton() {
  return (
    <div className='h-full w-100 shrink-0 py-2 pr-2'>
      <div className='bg-eerie-black z-9 flex h-full flex-col justify-between rounded-2xl'>
        <ChatHeader.Skeleton />
        <ChatBody.Skeleton />
        <ChatFooter.Skeleton />
      </div>
    </div>
  );
};
