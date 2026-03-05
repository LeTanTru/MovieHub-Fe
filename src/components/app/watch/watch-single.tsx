'use client';

import { caption } from '@/assets';
import { useQueryParams } from '@/hooks';
import { cn } from '@/lib';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { renderImageUrl } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useShallow } from 'zustand/shallow';

export default function WatchSingle() {
  const { searchParams } = useQueryParams<{ season: string }>();

  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  const seasons = movie?.seasons || [];

  return (
    <>
      <h3 className='mb-8 text-2xl font-semibold text-white'>Các bản chiếu</h3>
      {movie && seasons && seasons.length > 0 ? (
        <div className='grid grid-cols-3 gap-4'>
          {seasons.map((season) => (
            <Link
              href={`${route.watch.path}/${movie?.slug}.${movie?.id}?season=${season.label}`}
              key={season.id}
              className={cn(
                'bg-mid-gray relative w-full max-w-137.5 overflow-hidden rounded-lg text-white transition-all duration-200 ease-linear hover:-translate-y-1',
                {
                  'border-golden-glow border-2':
                    season.label === searchParams.season
                }
              )}
            >
              <div className='absolute top-0 right-0 bottom-0 w-2/5 max-w-32.5 mask-[linear-gradient(270deg,black_0,transparent_95%)]'>
                <Image
                  src={renderImageUrl(season?.thumbnailUrl)}
                  alt={`${movie?.title} - ${movie?.originalTitle}`}
                  fill
                  className='aspect-video h-full w-full object-cover'
                  sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                />
              </div>
              <div className='relative z-2 flex w-9/10 flex-col justify-center justify-start gap-4 p-6'>
                <div className='inline-flex items-center gap-2'>
                  <Image
                    src={caption}
                    alt='Caption'
                    className='h-5 w-5 object-cover'
                  />
                  <span>Phụ đề</span>
                </div>
                <div className='text-base leading-normal font-semibold'>
                  {season?.title}
                </div>
                <div className='inline-flex min-h-7.5 w-fit items-center justify-center rounded-sm bg-white px-3 py-2 text-xs font-medium text-black transition-all duration-200 ease-linear hover:opacity-80'>
                  Xem bản này
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-gray-400'>Chưa có tập phim nào</p>
      )}
    </>
  );
}
