'use client';

import { PlayIcon } from '@/assets';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import Link from 'next/link';

export default function ButtonPlay({
  href,
  title,
  className
}: {
  href: string;
  title?: string;
  className?: string;
}) {
  const { iconRef, startAnimation } = useClickAnimation();

  const handleClick = () => {
    startAnimation();
  };

  return (
    <Link
      className={cn('button-play', className)}
      href={href}
      title={title}
      onClick={handleClick}
    >
      <PlayIcon ref={iconRef} />
    </Link>
  );
}
