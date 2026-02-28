'use client';

import { Button } from '@/components/form';

export default function ButtonMovieTheater() {
  return (
    <Button
      variant='ghost'
      className='hover:text-golden-glow group flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
    >
      Rạp phim
      <span className='group-hover:border-golden-glow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100'>
        OFF
      </span>
    </Button>
  );
}
