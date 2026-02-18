'use client';

import { TelegramIcon } from '@/assets';
import { Button } from '@/components/form';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { notify } from '@/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ButtonShareMovie({
  className
}: {
  className?: string;
}) {
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
      className={cn(
        'hover:text-light-golden-yellow h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10',
        className
      )}
      variant='ghost'
      onClick={handleCopyLink}
    >
      <TelegramIcon ref={iconRef} />
      Chia sẻ
    </Button>
  );
}
