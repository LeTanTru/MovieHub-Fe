'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';
import { cva, VariantProps } from 'class-variance-authority';
import { notify } from '@/utils';
import { ROOM_STATE_ENDED } from '@/constants';
import { TelegramIcon } from '@/assets';
import { useClickAnimation } from '@/hooks';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRoomStore } from '@/store';

const variants = cva('', {
  variants: {
    variant: {
      detail:
        'hover:text-golden-glow h-fit min-w-20 flex-col px-2 hover:bg-white/10',
      watch:
        'hover:text-golden-glow group flex h-10 items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
    }
  },
  defaultVariants: {
    variant: 'detail'
  }
});

type ButtonShareMovieProps = {
  className?: string;
} & VariantProps<typeof variants>;

export function ButtonShareMovie({
  className,
  variant
}: ButtonShareMovieProps) {
  const pathname = usePathname();
  const room = useRoomStore((state) => state.room);
  const [link, setLink] = useState('');
  const { iconRef, startAnimation } = useClickAnimation();

  useEffect(() => {
    setLink(`${window.location.origin}${pathname}`);
  }, [pathname]);

  const handleCopyLink = async () => {
    startAnimation();
    await navigator.clipboard.writeText(link);
    notify.success('Đã sao chép liên kết phim');
  };

  if (!room || room.state === ROOM_STATE_ENDED) return null;

  return (
    <Button
      className={cn(variants({ variant }), className)}
      variant='ghost'
      onClick={handleCopyLink}
    >
      <TelegramIcon ref={iconRef} />
      <span
        className={cn({
          'max-640:sr-only': variant === 'watch'
        })}
      >
        Chia sẻ
      </span>
    </Button>
  );
}
