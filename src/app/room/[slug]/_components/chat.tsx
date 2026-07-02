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
          'max-1200:p-0 max-1200:w-80 max-1680:w-95 max-800:p-0 max-800:w-full border-transparent-white-2 max-800:h-auto max-800:relative max-800:grow relative w-110 grow translate-x-0 border-t border-solid opacity-100':
            !toggleChat,
          'p-1': !toggleChatLayout
        }
      )}
    >
      <div
        className={cn('max-1200:rounded-none z-9 flex h-full flex-col', {
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
    <div className='max-1200:p-0 max-1200:w-80 max-1680:w-95 max-800:p-0 max-800:w-full max-800:h-auto max-800:relative max-800:grow border-transparent-white-2 relative h-full w-110 shrink-0 grow border-t border-solid p-1'>
      <div className='max-1200:rounded-none bg-eerie-black z-9 flex h-full flex-col justify-between rounded-2xl'>
        <ChatHeader.Skeleton />
        <ChatBody.Skeleton />
        <ChatFooter.Skeleton />
      </div>
    </div>
  );
};
