'use client';

import { ButtonToggle } from '@/components/app/button-toggle';
import { PortalDropdown } from '@/components/dropdown';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';

export function ChatHeader() {
  const [toggleChat, setToggletChat] = useState<boolean>(false);
  const [toggletHeader, setToggleHeader] = useState<boolean>(false);
  const [toggletChatLeft, setToggletChatLeft] = useState<boolean>(false);
  const [toggleChatLayout, setToggleChatLayout] = useState<boolean>(false);

  const handleToggletChat = () => {
    setToggletChat(!toggleChat);
  };

  const handleToggleHeader = () => {
    setToggleHeader(!toggletHeader);
  };

  const handleToggletChatLeft = () => {
    setToggletChatLeft(!toggletChatLeft);
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
              toggle={toggletHeader}
              onToggle={handleToggleHeader}
              align='left'
              className='justify-between'
            />
          </div>
          <div className='px-4 py-2'>
            <ButtonToggle
              text='Khung chat trái'
              toggle={toggletChatLeft}
              onToggle={handleToggletChatLeft}
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
          onToggle={handleToggletChat}
          align='left'
        />
      </div>
    </div>
  );
}
