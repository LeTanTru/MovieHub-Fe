'use client';

import { MessageEmptyIcon } from '@/assets';

export function ChatBody() {
  return (
    <div className='relative flex grow flex-col justify-between gap-1 overflow-hidden'>
      <div className='flex flex-col items-center justify-center gap-4 rounded-2xl px-4 py-12'>
        <MessageEmptyIcon iconClassName='size-16' />
        <p className='text-center text-gray-300'>
          Chưa có tin nhắn nào trong phòng chat này. <br /> Hãy gửi tin nhắn đầu
          tiên để bắt đầu cuộc trò chuyện nhé !
        </p>
      </div>
    </div>
  );
}
