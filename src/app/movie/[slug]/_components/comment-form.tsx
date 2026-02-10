'use client';

import { ButtonToggle } from '@/components/app/button-toggle';
import { route } from '@/routes';
import { notify } from '@/utils';
import Link from 'next/link';
import { useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks';

export default function CommentForm({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const [toggle, setToggle] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để tham gia bình luận
        </span>
      );
      return;
    }
  };

  if (isLoading)
    return (
      <div className='bg-discussion-form flex flex-col gap-2 rounded-[12px] p-2'>
        <Skeleton className='skeleton h-28 w-full rounded-md' />
        <div className='flex items-center gap-4'>
          <Skeleton className='skeleton h-8 w-24 rounded' />
          <div className='grow'></div>
          <Skeleton className='skeleton h-10 w-20 rounded' />
        </div>
      </div>
    );

  return (
    <div className='bg-discussion-form flex flex-col gap-2 rounded-[12px] p-2'>
      <div className='relative'>
        <textarea
          className='bg-discussion-input block h-auto min-h-8.75 w-full resize-none rounded-md border border-solid border-transparent px-5 py-4 leading-normal font-normal text-white'
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
          onClick={handleSubmit}
        >
          <span>Gửi</span>
          <FaTelegramPlane />
        </button>
      </div>
    </div>
  );
}
