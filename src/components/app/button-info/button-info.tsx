'use client';

import { InfoIcon } from '@/assets';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import Link from 'next/link';

export default function ButtonInfo({
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
      className={cn('item group', className)}
      href={href}
      title={title}
      onClick={handleClick}
    >
      <div className='inc-icon icon-20'>
        <InfoIcon
          ref={iconRef}
          iconClassName='group-hover:fill-golden-glow size-5 fill-white stroke-black transition-colors ease-linear duration-200'
        />
      </div>
    </Link>
  );
}
