'use client';

import { TelegramIcon } from '@/assets';
import { Button } from '@/components/form';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { notify } from '@/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const variants = cva('', {
  variants: {
    variant: {
      detail:
        'hover:text-light-golden-yellow h-fit min-w-20 flex-col px-2 text-xs hover:bg-white/10',
      watch:
        'hover:text-light-golden-yellow group flex h-10 items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
    }
  },
  defaultVariants: {
    variant: 'detail'
  }
});

export default function ButtonShareMovie({
  className,
  variant
}: {
  className?: string;
} & VariantProps<typeof variants>) {
  const pathname = usePathname();
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

  return (
    <Button
      className={cn(variants({ variant }), className)}
      variant='ghost'
      onClick={handleCopyLink}
    >
      <TelegramIcon ref={iconRef} />
      Chia sẻ
    </Button>
  );
}
