'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';
import { FaFlag } from 'react-icons/fa6';

export default function ButtonReport({ className }: { className?: string }) {
  return (
    <Button
      variant='ghost'
      className={cn(
        'dark:hover:text-golden-glow flex h-10! items-center justify-center gap-2 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear dark:hover:bg-white/10',
        className
      )}
    >
      <FaFlag /> <span className='max-520:hidden'>Báo lỗi</span>
    </Button>
  );
}
