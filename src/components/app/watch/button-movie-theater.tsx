'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';
import { useEffect, useState } from 'react';

export default function ButtonMovieTheater() {
  const [isMovieTheater, setIsMovieTheater] = useState(false);

  useEffect(() => {
    if (isMovieTheater) {
      document.body.classList.add('movie-theater');
    } else {
      document.body.classList.remove('movie-theater');
    }
    return () => {
      document.body.classList.remove('movie-theater');
    };
  }, [isMovieTheater]);

  const handleToggleMovieTheater = () => {
    setIsMovieTheater((prev) => !prev);
  };

  return (
    <Button
      variant='ghost'
      className={cn(
        'button-movie-theater hover:text-golden-glow group flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10',
        {
          'bg-white/10': isMovieTheater
        }
      )}
      onClick={handleToggleMovieTheater}
    >
      Rạp phim
      <span
        className={cn(
          'group-hover:border-golden-glow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100',
          {
            'border-golden-glow text-golden-glow opacity-100': isMovieTheater
          }
        )}
      >
        {isMovieTheater ? 'ON' : 'OFF'}
      </span>
    </Button>
  );
}
