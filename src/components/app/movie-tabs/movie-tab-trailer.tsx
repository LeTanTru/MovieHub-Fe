'use client';

import { ButtonToggle } from '@/components/app/button-toggle';
import { CircleLoading } from '@/components/loading';
import { cn } from '@/lib';
import { FaPlay } from 'react-icons/fa6';
import { m } from 'framer-motion';
import { MOVIE_TAB_TRAILER } from '@/constants';
import { notify, renderImageUrl } from '@/utils';
import { TrailerModal } from '@/components/app/trailer-modal';
import { useDisclosure, useAnonymousToken } from '@/hooks';
import { useState } from 'react';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import Image from 'next/image';
import { MotionWrapper } from './motion-wrapper';
import { MovieTabHeading } from '@/components/app/heading';

type MovieTabTrailerProps = {
  direction: number;
};

export function MovieTabTrailer({ direction }: MovieTabTrailerProps) {
  const [toggle, setToggle] = useState(true);
  const { opened, open, close } = useDisclosure();
  const { token, isLoadingToken } = useAnonymousToken();

  const { movie, selectedSeason } = useMovieStore(
    useShallow((s) => ({
      movie: s.movie,
      selectedSeason: s.selectedSeason
    }))
  );

  const currentSeason = movie?.seasons?.find(
    (season) => season.label === selectedSeason
  );

  const trailer = currentSeason?.trailer;

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const handlePlayTrailer = async () => {
    if (isLoadingToken) return;

    if (!token) {
      notify.error('Không thể tải trailer, vui lòng thử lại');
      return;
    }
    open();
  };

  const handleCloseTrailer = () => {
    close();
  };

  if (!movie) return null;

  return (
    <>
      <MotionWrapper uniqueKey={MOVIE_TAB_TRAILER} direction={direction}>
        <div className='flex items-center justify-between'>
          <MovieTabHeading title={`Trailer phim ${movie.title}`} />
          {trailer?.video && (
            <>
              <div className='grow'></div>
              <ButtonToggle
                toggle={toggle}
                onToggle={handleToggle}
                text='Rút gọn'
                disabled={isLoadingToken}
              />
            </>
          )}
        </div>

        {trailer?.video && (
          <div
            className={cn('grid', {
              'max-1120:grid-cols-5 max-990:grid-cols-4 max-640:grid-cols-3 max-520:grid-cols-2 grid-cols-6 gap-x-2.5 gap-y-8':
                !toggle,
              'max-1360:grid-cols-6 max-990:grid-cols-4 max-640:grid-cols-3 max-520:grid-cols-2 grid-cols-8 gap-2.5':
                toggle
            })}
          >
            <m.div
              layout
              transition={{
                layout: { duration: 0.15, ease: 'linear' }
              }}
              className={cn('cursor-pointer', {
                'pointer-events-none cursor-not-allowed opacity-50 select-none':
                  isLoadingToken
              })}
              onClick={handlePlayTrailer}
            >
              <div
                className={cn('block', {
                  'bg-charade hover:text-golden-glow flex h-12.5 items-center justify-center gap-2 rounded-sm px-[3.5px]':
                    toggle
                })}
              >
                <div
                  className={cn(
                    'bg-gunmetal-blue group relative mb-2.5 block w-full overflow-hidden rounded-md',
                    {
                      'h-0 pb-[66%]': !toggle,
                      hidden: toggle
                    }
                  )}
                >
                  <div className='group-hover:text-golden-glow border-golden-glow absolute top-1/2 left-1/2 z-3 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-solid bg-[rgba(0,0,0,0.5)] pl-0.5 opacity-0 transition-all duration-200 ease-linear group-hover:opacity-100'>
                    <FaPlay />
                  </div>
                  {trailer.thumbnailUrl ? (
                    <Image
                      src={renderImageUrl(trailer.thumbnailUrl)}
                      className='aspect-video h-full w-full border-none object-cover'
                      alt={trailer.title}
                      fill
                      sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                      unoptimized
                    />
                  ) : (
                    <Image
                      src='/logo.webp'
                      alt={trailer.title}
                      width={100}
                      height={100}
                      className='absolute top-1/2 left-1/2 m-auto -translate-x-1/2 -translate-y-1/2 object-cover'
                    />
                  )}
                  <div className='absolute inset-0 bg-[rgba(0,0,0,0.3)] transition-colors duration-200 ease-linear group-hover:bg-[rgba(0,0,0,0.5)]'></div>
                  {isLoadingToken && (
                    <div className='absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2'>
                      <CircleLoading />
                    </div>
                  )}
                </div>
                {isLoadingToken && toggle ? (
                  <CircleLoading />
                ) : (
                  <>
                    <div className='transition-color hover:text-golden-glow max-640:text-[13px] flex items-center gap-2.5 font-medium text-white duration-200 ease-linear'>
                      <div className='block shrink-0 text-xs'>
                        <FaPlay />
                      </div>
                      <div className='line-clamp-1 block truncate'>Trailer</div>
                    </div>
                  </>
                )}
              </div>
            </m.div>
          </div>
        )}
        {!trailer?.video && (
          <p className='text-accent-foreground'>
            Trailer cho phim&nbsp;
            <span className='font-semibold'>{movie.title}</span>&nbsp;đang được
            cập nhật
          </p>
        )}
      </MotionWrapper>

      {trailer?.video && (
        <TrailerModal
          opened={opened}
          onClose={handleCloseTrailer}
          video={trailer.video}
          token={token}
        />
      )}
    </>
  );
}
