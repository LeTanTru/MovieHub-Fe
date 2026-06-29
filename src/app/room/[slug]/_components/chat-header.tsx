'use client';

import { ButtonToggle } from '@/components/app/button-toggle';
import { PortalDropdown } from '@/components/dropdown';
import { useChatStore } from '@/store';
import { MenuIcon } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { Skeleton } from '@/components/ui/skeleton';

export function ChatHeader() {
  const {
    toggleChat,
    toggleHeader,
    toggleChatLeft,
    toggleChatLayout,
    setToggleChat,
    setToggleHeader,
    setToggleChatLeft,
    setToggleChatLayout
  } = useChatStore(
    useShallow((state) => ({
      toggleChat: state.toggleChat,
      toggleHeader: state.toggleHeader,
      toggleChatLeft: state.toggleChatLeft,
      toggleChatLayout: state.toggleChatLayout,

      setToggleChat: state.setToggleChat,
      setToggleHeader: state.setToggleHeader,
      setToggleChatLeft: state.setToggleChatLeft,
      setToggleChatLayout: state.setToggleChatLayout
    }))
  );

  const handleToggleChat = () => {
    setToggleChat(!toggleChat);
  };

  const handleToggleHeader = () => {
    setToggleHeader(!toggleHeader);
  };

  const handleToggleChatLeft = () => {
    setToggleChatLeft(!toggleChatLeft);
  };

  const handleToggleChatLayout = () => {
    setToggleChatLayout(!toggleChatLayout);
  };

  return (
    <div className='flex shrink-0 items-center gap-4 p-4'>
      {/* Menu button */}
      <div className='relative cursor-pointer'>
        <PortalDropdown
          align='left'
          offsetX={-10}
          className='bg-charade min-w-36 overflow-hidden rounded-lg py-1 shadow-lg'
          trigger={
            <div className='inline-flex items-center gap-2 whitespace-nowrap text-white transition-all duration-200 ease-linear select-none hover:opacity-80'>
              <MenuIcon className='size-4' />
              <span>Tùy chỉnh</span>
            </div>
          }
        >
          <div className='px-4 py-2'>
            <ButtonToggle
              text='Ẩn đầu trang'
              toggle={toggleHeader}
              onToggle={handleToggleHeader}
              align='left'
              className='justify-between'
            />
          </div>
          <div className='px-4 py-2'>
            <ButtonToggle
              text='Khung chat trái'
              toggle={toggleChatLeft}
              onToggle={handleToggleChatLeft}
              align='left'
              className='justify-between'
            />
          </div>
          <div className='px-4 py-2'>
            <ButtonToggle
              text='Thu gọn'
              toggle={toggleChatLayout}
              onToggle={handleToggleChatLayout}
              align='left'
              className='justify-between'
            />
          </div>
        </PortalDropdown>
      </div>
      <div className='grow'></div>
      {/* Hide chat button */}
      <div className='relative inline-flex items-center gap-2 select-none'>
        <ButtonToggle
          text='Ẩn chat'
          toggle={toggleChat}
          onToggle={handleToggleChat}
          align='left'
        />
      </div>
    </div>
  );
}

ChatHeader.Skeleton = function ChatHeaderSkeleton() {
  return (
    <div className='flex shrink-0 items-center gap-4 p-4'>
      <div className='inline-flex items-center gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton size-4 rounded!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-16 rounded!' />
      </div>
      <div className='grow'></div>
      <div className='inline-flex items-center gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-12 rounded!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-5 w-9 rounded-full!' />
      </div>
    </div>
  );
};
