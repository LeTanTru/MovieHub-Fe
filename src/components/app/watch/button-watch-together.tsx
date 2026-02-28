'use client';

import { Button } from '@/components/form';
import { CiStreamOn } from 'react-icons/ci';

export default function ButtonWatchTogether() {
  return (
    <Button
      variant='ghost'
      className='hover:text-golden-glow flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
    >
      <CiStreamOn className='size-5' />
      Xem chung
    </Button>
  );
}
