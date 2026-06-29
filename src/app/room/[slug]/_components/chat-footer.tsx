'use client';

import { FaUser } from 'react-icons/fa6';
import { useAuth } from '@/hooks';
import ChatInput from './chat-input';

export function ChatFooter() {
  const { profile } = useAuth();

  return (
    <div className='relative z-3 flex shrink-0 flex-col gap-3 p-4'>
      <ChatInput />
      <div className='relative flex items-center gap-2'>
        <div className='inline-flex items-center gap-2'>
          <FaUser className='text-golden-glow' />
          <span>{profile?.username || profile?.fullName}</span>
        </div>
      </div>
    </div>
  );
}
