'use client';

import { ChatBody } from './chat-list';
import { ChatFooter } from './chat-footer';
import { ChatHeader } from './chat-header';

export function Chat() {
  return (
    <div className='h-page-height w-100 shrink-0 py-2 pr-2'>
      <div className='bg-eerie-black border-transparent-black-2 z-9 flex h-full flex-col justify-between rounded-2xl border border-solid'>
        <ChatHeader />
        <ChatBody />
        <ChatFooter />
      </div>
    </div>
  );
}

Chat.Skeleton = function ChatSkeleton() {
  return (
    <div className='h-page-height w-100 shrink-0 py-2 pr-2'>
      <div className='bg-eerie-black border-transparent-black-2 z-9 flex h-full flex-col justify-between rounded-2xl border border-solid'>
        <ChatHeader.Skeleton />
        <ChatBody.Skeleton />
        <ChatFooter.Skeleton />
      </div>
    </div>
  );
};
