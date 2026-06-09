'use client';

import { ButtonNew } from './button-new';
import { Podcast } from 'lucide-react';
import { route } from '@/routes';
import Link from 'next/link';

export function RoomManager() {
  return (
    <div className='relative mx-auto flex h-50 w-full max-w-475 items-center justify-center px-12.5'>
      <div className='inline-flex items-center gap-4'>
        <Link
          className='flex min-h-10! items-center justify-center gap-2 rounded-4xl border border-white bg-white px-7 py-2.5 text-lg font-medium text-black backdrop-blur-[10px] transition-opacity duration-200 ease-linear hover:opacity-80'
          href={route.room.manage.path}
        >
          <Podcast size={18} /> Quản lý
        </Link>
        <ButtonNew />
      </div>
    </div>
  );
}
