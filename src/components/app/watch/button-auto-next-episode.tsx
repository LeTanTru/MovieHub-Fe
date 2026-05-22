'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';

type ButtonAutoNextEpisodeProps = {
  autoNextEpisode: boolean;
  onClick: () => void;
  className?: string;
};

export function ButtonAutoNextEpisode({
  autoNextEpisode,
  className,
  onClick
}: ButtonAutoNextEpisodeProps) {
  return (
    <Button
      variant='ghost'
      className={cn(
        'hover:text-golden-glow group flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10',
        className
      )}
      onClick={onClick}
    >
      Chuyển tập
      <span
        className={cn(
          'group-hover:border-golden-glow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none transition-all duration-200 ease-linear',
          {
            'border-golden-glow text-golden-glow opacity-100': autoNextEpisode,
            'opacity-50 group-hover:opacity-100': !autoNextEpisode
          }
        )}
      >
        {autoNextEpisode ? 'ON' : 'OFF'}
      </span>
    </Button>
  );
}
