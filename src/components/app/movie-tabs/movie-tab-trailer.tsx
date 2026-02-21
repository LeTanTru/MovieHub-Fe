'use client';

import { ButtonToggle } from '@/components/app/button-toggle';
import { CircleLoading } from '@/components/loading';
import { cn } from '@/lib';
import { FaPlay } from 'react-icons/fa6';
import { getAnonymousToken } from '@/app/actions/anonymous';
import { logger } from '@/logger';
import { motion } from 'framer-motion';
import { MOVIE_TAB_TRAILER } from '@/constants';
import { notify, renderImageUrl } from '@/utils';
import { TrailerModal } from '@/components/app/trailer-modal';
import { useDisclosure } from '@/hooks';
import { useEffect, useState } from 'react';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import Image from 'next/image';
import MotionWrapper from './motion-wrapper';

export default function MovieTabTrailer({ direction }: { direction: number }) {
  const [toggle, setToggle] = useState(true);
  const { opened, open, close } = useDisclosure();
  const [isFetching, setIsFetching] = useState(false);
  const [token, setToken] = useState<string>('');

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
    if (isFetching) return;

    setIsFetching(true);
    try {
      const res = await getAnonymousToken();
      setToken(res.access_token);
      open();
    } catch (err) {
      logger.error('Failed to get guest token', err);
      notify.error('Không thể tải trailer, vui lòng thử lại');
    } finally {
      setIsFetching(false);
    }
  };

  const handleCloseTrailer = () => {
    close();
    setToken('');
  };

  useEffect(() => {
    if (!opened || !token) return;

    const intervalId = setInterval(
      async () => {
        try {
          const res = await getAnonymousToken();
          setToken(res.access_token);
        } catch (err) {
          logger.error('Failed to refresh guest token', err);
        }
      },
      14 * 60 * 1000
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [opened, token]);

  if (!movie || !trailer) return null;

  return (
    <>
      <MotionWrapper uniqueKey={MOVIE_TAB_TRAILER} direction={direction}>
        <div className='mb-8 flex items-center justify-between gap-8'>
          <h3 className='text-lg leading-normal font-semibold text-white'>
            Trailer phim {movie.title}
          </h3>
          <div className='grow'></div>
          <ButtonToggle
            toggle={toggle}
            handleToggle={handleToggle}
            text='Rút gọn'
            disabled={isFetching}
          />
        </div>

        <div
          className={cn('grid', {
            'grid-cols-6 gap-x-2.5 gap-y-8': !toggle,
            'grid-cols-8 gap-2.5': toggle
          })}
        >
          <motion.div
            layout
            transition={{
              layout: { duration: 0.15, ease: 'linear' }
            }}
            className={cn('cursor-pointer', {
              'pointer-events-none cursor-not-allowed opacity-50 select-none':
                isFetching
            })}
            onClick={handlePlayTrailer}
          >
            <div
              className={cn('block', {
                'bg-episode-1 hover:text-light-golden-yellow flex h-12.5 items-center justify-center gap-2 rounded-sm px-[3.5px]':
                  toggle
              })}
            >
              <div
                className={cn(
                  'bg-episode-2 group relative mb-2.5 block w-full overflow-hidden rounded-md',
                  {
                    'h-0 pb-[66%]': !toggle,
                    hidden: toggle
                  }
                )}
              >
                <div className='group-hover:text-light-golden-yellow border-light-golden-yellow absolute top-1/2 left-1/2 z-3 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-solid bg-[rgba(0,0,0,0.5)] pl-0.5 opacity-0 transition-all duration-200 ease-linear group-hover:opacity-100'>
                  <FaPlay />
                </div>
                <Image
                  src={renderImageUrl(trailer.thumbnailUrl)}
                  className='aspect-video h-full w-full border-none object-cover'
                  alt={trailer.title}
                  fill
                  sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                  unoptimized
                />
                <div className='absolute inset-0 bg-[rgba(0,0,0,0.3)] transition-colors duration-200 ease-linear group-hover:bg-[rgba(0,0,0,0.5)]'></div>
                {isFetching && (
                  <div className='absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2'>
                    <CircleLoading />
                  </div>
                )}
              </div>
              {isFetching && toggle ? (
                <CircleLoading />
              ) : (
                <>
                  <div
                    className={cn(
                      'transition-color hover:text-light-golden-yellow flex items-center gap-2.5 text-sm font-medium text-white duration-200 ease-linear'
                    )}
                  >
                    <div className='block shrink-0 text-xs'>
                      <FaPlay />
                    </div>
                    <div className='line-clamp-1 block truncate'>Trailer</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </MotionWrapper>

      <TrailerModal
        opened={opened}
        onClose={handleCloseTrailer}
        video={trailer.video}
        token={token}
      />
    </>
  );
}
