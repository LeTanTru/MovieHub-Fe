import { InfoIcon } from '@/assets';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import Link from 'next/link';

type ButtonInfoProps = {
  href: string;
  title?: string;
  className?: string;
};

export function ButtonInfo({ href, title, className }: ButtonInfoProps) {
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
