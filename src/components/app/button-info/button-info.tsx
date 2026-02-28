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
      className={cn('item', className)}
      href={href}
      title={title}
      onClick={handleClick}
    >
      <div className='inc-icon icon-20 group'>
        <InfoIcon
          ref={iconRef}
          iconClassName='group-hover:text-golden-glow size-5 text-white stroke-black transition-colors ease-linear duration-200'
        />
      </div>
    </Link>
  );
}
