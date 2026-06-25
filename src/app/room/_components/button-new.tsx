'use client';

import { Button } from '@/components/form';
import { PlusCircle } from 'lucide-react';

export function ButtonNew() {
  return (
    <Button
      className='group flex h-auto! min-h-10! items-center justify-center gap-2 rounded-4xl border border-white px-7! py-2.5! text-lg font-medium text-white backdrop-blur-[10px] hover:border-white/80 hover:text-white/80'
      variant='outline'
    >
      <PlusCircle className='max-1024:size-5 max-640:size-4 size-6 fill-white text-black group-hover:opacity-80' />
      Tạo mới
    </Button>
  );
}
