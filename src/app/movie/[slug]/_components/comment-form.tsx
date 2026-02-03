'use client';

import { ButtonToggle } from '@/components/app/button-toggle';
import { useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

export default function CommentForm() {
  const [toggle, setToggle] = useState<boolean>(false);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <div className='bg-comment-form-background flex flex-col gap-2 rounded-[12px] p-2'>
      <div className='relative'>
        <textarea
          className='block h-auto min-h-8.75 w-full resize-none rounded-md border border-solid border-transparent bg-[#191B24] px-5 py-4 leading-normal font-normal text-white'
          rows={4}
          cols={3}
          placeholder='Viết bình luận'
          maxLength={1000}
        />
        <div className='absolute top-2 right-2.5 leading-none text-gray-400'>
          0/1000
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 select-none'>
          <ButtonToggle
            toggle={toggle}
            handleToggle={handleToggle}
            text='Tiết lộ?'
          />
        </div>
        <div className='grow'></div>
        <button
          className='text-light-golden-yellow flex min-h-10 cursor-pointer items-center justify-center gap-2 bg-transparent px-4.5 py-2 font-medium transition-all duration-200 ease-linear hover:opacity-80'
          type='button'
        >
          <span>Gửi</span>
          <FaTelegramPlane />
        </button>
      </div>
    </div>
  );
}
