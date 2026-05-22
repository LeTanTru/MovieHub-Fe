import { PlayIcon } from '@/assets';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import Link from 'next/link';

type ButtonPlayProps = {
  href: string;
  title?: string;
  className?: string;
};

export function ButtonPlay({ href, title, className }: ButtonPlayProps) {
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
