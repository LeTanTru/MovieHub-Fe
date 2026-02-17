'use client';

import { PlayIcon } from '@/assets';
import { Button } from '@/components/form';
import { cn } from '@/lib';
import { AnimatedIconHandle } from '@/types';
import Link from 'next/link';
import { useRef } from 'react';

export default function ButtonWatchNow({
  href,
  className
}: {
  href: string;
  className?: string;
}) {
  const playIconRef = useRef<AnimatedIconHandle>(null);

  const handleClick = () => {
    playIconRef.current?.startAnimation();
  };

  return (
    <Link href={href}>
      <Button className={cn('gap-2!', className)} onClick={handleClick}>
        <PlayIcon iconClassName='size-5' ref={playIconRef} />
        Xem ngay
      </Button>
    </Link>
  );
}
