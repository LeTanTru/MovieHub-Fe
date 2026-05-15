'use client';

import { caption } from '@/assets';
import { MovieTabHeading } from '@/components/app/heading';
import { useNavigate, useQueryParams } from '@/hooks';
import { cn } from '@/lib';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { notify, renderImageUrl } from '@/utils';
import Image from 'next/image';
import { useShallow } from 'zustand/shallow';

export default function WatchSingle() {
  const navigate = useNavigate();
  const { searchParams } = useQueryParams<{ season: string }>();
  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  const seasons = movie?.seasons || [];

  const handleSeasonClick = (season: (typeof seasons)[0]) => {
    if (season.label === searchParams.season) {
      notify.info('Bản này đang được phát');
      return;
    }
    navigate.push(
      `${route.watch.path}/${movie?.slug}.${movie?.id}?season=${season.label}`
    );
  };

  return (
    <>
      <MovieTabHeading title='Các bản chiếu' />
      {movie && seasons && seasons.length > 0 ? (
        <div className='max-990:grid-cols-2 max-520:grid-cols-1 grid grid-cols-3 gap-4'>
          {seasons.map((season) => (
            <button
              onClick={() => handleSeasonClick(season)}
              key={season.id}
              className={cn(
                'bg-mid-gray relative w-full max-w-137.5 cursor-pointer overflow-hidden rounded-lg text-white transition-all duration-200 ease-linear hover:-translate-y-1',
                {
                  'border-golden-glow border-2':
                    season.label === searchParams.season
                }
              )}
            >
              <div className='max-990:max-w-90 max-990:w-[45%] absolute top-0 right-0 bottom-0 w-2/5 max-w-32.5 mask-[linear-gradient(270deg,black_0,transparent_95%)]'>
                {season.thumbnailUrl ? (
                  <Image
                    src={renderImageUrl(season.thumbnailUrl)}
                    className='aspect-video h-full w-full border-none object-cover'
                    alt={season.title}
                    fill
                    sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                  />
                ) : (
                  <Image
                    src='/logo.webp'
                    alt={season.title}
                    width={100}
                    height={100}
                    className='absolute top-1/2 left-1/2 m-auto -translate-x-1/2 -translate-y-1/2 object-cover'
                  />
                )}
              </div>
              <div className='max-990:w-7/10 relative z-2 flex w-9/10 flex-col items-start justify-center gap-4 p-6'>
                <div className='inline-flex items-center gap-2'>
                  <Image
                    src={caption}
                    alt='Caption'
                    className='size-5 object-cover'
                  />
                  <span>Phụ đề</span>
                </div>
                <span className='text-base leading-normal font-semibold'>
                  {season?.title}
                </span>
                <div className='inline-flex min-h-7.5 w-fit items-center justify-center rounded-sm bg-white px-3 py-2 text-xs font-medium text-black transition-all duration-200 ease-linear hover:opacity-80'>
                  Xem bản này
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className='text-accent-foreground'>Tập phim đang được cập nhật</p>
      )}
    </>
  );
}
