'use client';

import { TelegramIcon } from '@/assets';
import { Button } from '@/components/form';
import { AnimatedIconHandle } from '@/types';
import { notify } from '@/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ButtonShareMovie() {
  const pathname = usePathname();
  const [link, setLink] = useState('');
  const telegramIconRef = useRef<AnimatedIconHandle>(null);

  useEffect(() => {
    setLink(`${window.location.origin}${pathname}`);
  }, [pathname]);

  const handleCopyLink = async () => {
    telegramIconRef.current?.startAnimation();
    await navigator.clipboard.writeText(link);
    notify.success('Đã sao chép liên kết phim');
  };

  return (
    <Button
      className='hover:text-light-golden-yellow h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10'
      variant='ghost'
      onClick={handleCopyLink}
    >
      <TelegramIcon ref={telegramIconRef} />
      Chia sẻ
    </Button>
  );
}
