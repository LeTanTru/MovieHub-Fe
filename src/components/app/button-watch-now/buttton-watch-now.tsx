'use client';

import { PlayIcon } from '@/assets';
import { Button } from '@/components/form';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { cva, VariantProps } from 'class-variance-authority';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

const variants = cva('w-fit', {
  variants: {
    variant: {
      detail:
        'text-black-denim inline-flex min-h-15 shrink-0 items-center justify-center  rounded-full bg-[linear-gradient(39deg,rgba(254,207,89,1),rgba(255,241,204,1))] px-8 py-4 text-base font-semibold shadow-[0_5px_10px_5px_rgba(255,218,125,.1)] hover:opacity-90 hover:shadow-[0_5px_10px_10px_rgba(255,218,125,.15)]',
      popup: 'bg-golden-glow hover:bg-golden-glow/80 w-full text-black'
    }
  },
  defaultVariants: {
    variant: 'detail'
  }
});

type ButtonWatchNowProps = {
  href?: string;
  className?: string;
} & VariantProps<typeof variants>;

export function ButtonWatchNow({
  href,
  className,
  variant
}: ButtonWatchNowProps) {
  const { iconRef, startAnimation } = useClickAnimation();

  const handleClick = () => {
    startAnimation();
  };

  return href ? (
    <Link href={href}>
      <Button
        className={cn(variants({ variant }), className)}
        onClick={handleClick}
      >
        <PlayIcon iconClassName='size-5 max-640:size-4' ref={iconRef} />
        Xem ngay
      </Button>
    </Link>
  ) : (
    <Button
      className={cn(variants({ variant }), className)}
      onClick={handleClick}
    >
      <Calendar className='size-4' />
      Sắp chiếu
    </Button>
  );
}
