'use client';

import { TelegramIcon } from '@/assets';
import { Button } from '@/components/form';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { notify } from '@/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ButtonSharePerson({
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
    notify.success('Đã sao chép liên kết');
  };

  return (
    <Button
      className={cn(
        'dark:hover:text-golden-glow dark:hover:border-golden-glow rounded-full',
        className
      )}
      variant='outline'
      onClick={handleCopyLink}
    >
      <TelegramIcon ref={iconRef} />
      Chia sẻ
    </Button>
  );
}
