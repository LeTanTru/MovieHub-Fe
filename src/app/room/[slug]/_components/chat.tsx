'use client';

import { Button } from '@/components/form';
import { ChatBody } from './chat-list';
import { ChatFooter } from './chat-footer';
import { ChatHeader } from './chat-header';
import { cn } from '@/lib';
import { MessageSquare } from 'lucide-react';
import { useChatStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function Chat() {
  const { toggleChat, toggleChatLayout, setToggleChat } = useChatStore(
    useShallow((state) => ({
      toggleChat: state.toggleChat,
      toggleChatLayout: state.toggleChatLayout,
      setToggleChat: state.setToggleChat
    }))
  );

  const handleToggleChat = () => {
    setToggleChat(!toggleChat);
  };

  return (
    <>
      <div
        className={cn(
          'absolute top-1/2 right-0 z-10 -translate-y-1/2 transition-transform duration-200 ease-linear',
          {
            'translate-x-0': toggleChat,
            'translate-x-[150%]': !toggleChat
          }
        )}
      >
        <Button
          variant='ghost'
          className='bg-transparent-black-8 flex items-center gap-2 rounded-l-xl rounded-r-none border border-r-0 border-solid border-white/20 p-3 text-white hover:bg-white/10 hover:text-white'
          onClick={handleToggleChat}
        >
          <MessageSquare className='size-5' />
          <span>Hiện chat</span>
        </Button>
      </div>

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
          className={cn('z-9 flex h-full flex-col justify-between', {
            'bg-eerie-black border-transparent-black-2 rounded-2xl border border-solid':
              !toggleChatLayout,
            'bg-transparent-black-8': toggleChatLayout
          })}
        >
          <ChatHeader />
          <ChatBody />
          <ChatFooter />
        </div>
      </div>
    </>
  );
}

Chat.Skeleton = function ChatSkeleton() {
  return (
    <div className='h-full w-100 shrink-0 py-2 pr-2'>
      <div className='bg-eerie-black border-transparent-black-2 z-9 flex h-full flex-col justify-between rounded-2xl border border-solid'>
        <ChatHeader.Skeleton />
        <ChatBody.Skeleton />
        <ChatFooter.Skeleton />
      </div>
    </div>
  );
};
