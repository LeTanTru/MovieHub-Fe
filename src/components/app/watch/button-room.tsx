'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';
import { Podcast } from 'lucide-react';

type ButtonRoomProps = {
  className?: string;
};

export function ButtonRoom({ className }: ButtonRoomProps) {
  return (
    <Button
      variant='ghost'
      className={cn(
        'hover:text-golden-glow flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10',
        className
      )}
    >
      <Podcast className='size-5' />
      <span className='max-520:hidden'>Xem chung</span>
    </Button>
  );
}
