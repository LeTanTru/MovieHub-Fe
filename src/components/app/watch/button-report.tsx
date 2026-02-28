'use client';

import { Button } from '@/components/form';
import { FaFlag } from 'react-icons/fa6';

export default function ButtonReport() {
  return (
    <Button
      variant='ghost'
      className='hover:text-golden-glow flex h-10! items-center justify-center gap-2 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
    >
      <FaFlag /> Báo lỗi
    </Button>
  );
}
