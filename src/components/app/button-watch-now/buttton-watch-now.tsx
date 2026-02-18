'use client';

import { PlayIcon } from '@/assets';
import { Button } from '@/components/form';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import Link from 'next/link';

export default function ButtonWatchNow({
  href,
  className
}: {
  href: string;
  className?: string;
}) {
  const { iconRef, startAnimation } = useClickAnimation();

  const handleClick = () => {
    startAnimation();
  };

  return (
    <Link href={href}>
      <Button className={cn('gap-2!', className)} onClick={handleClick}>
        <PlayIcon iconClassName='size-5' ref={iconRef} />
        Xem ngay
      </Button>
    </Link>
  );
}
