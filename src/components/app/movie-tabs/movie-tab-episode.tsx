'use client';

import { caption } from '@/assets';
import { ButtonToggle } from '@/components/app/button-toggle';
import MotionWrapper from './motion-wrapper';
import { MOVIE_TAB_EPISODE, MOVIE_TYPE_SINGLE } from '@/constants';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { MovieResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaBarsStaggered, FaCaretDown, FaPlay } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';

const MovieTabEpisodeSingle = ({ movie }: { movie: MovieResType }) => {
  return (
    <>
      <h3 className='mb-8 text-2xl font-semibold text-white'>Các bản chiếu</h3>
      {movie && movie.seasons && movie.seasons.length > 0 ? (
        <div className='grid grid-cols-3 gap-4'>
          {movie.seasons.map((season) => (
            <Link
              href={`${route.watch.path}/${movie?.slug}.${movie?.id}?season=${season.label}`}
              key={season.id}
              className='bg-episode relative w-full max-w-137.5 overflow-hidden rounded-lg text-white transition-all duration-200 ease-linear hover:-translate-y-1'
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
              <div className='flex-start relative z-2 flex w-9/10 flex-col justify-center gap-4 p-6'>
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
};

const MovieTabEpisodeSeries = ({ movie }: { movie: MovieResType }) => {
  const ANIMATION_DURATION = 300;

  const [toggle, setToggle] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { selectedSeason, setSelectedSeason } = useMovieStore(
    useShallow((s) => ({
      selectedSeason: s.selectedSeason,
      setSelectedSeason: s.setSelectedSeason
    }))
  );

  const seasons = movie.seasons;
  const seasonCount = seasons.length;

  const currentSeason = seasons.find(
    (season) => season.ordering + 1 === selectedSeason
  );

  const episodes = currentSeason?.episodes || [];

  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setToggle(!toggle);

    setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  const handleSelectSeason = (index: number) => {
    // Plus one because index is zero-based
    setSelectedSeason(index + 1);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (movie.latestSeason) {
      setSelectedSeason(+movie.latestSeason);
    }
  }, [movie.latestSeason, setSelectedSeason]);

  return (
    <>
      {/* Header */}
      <div className='mb-8 flex items-center justify-between gap-8'>
        <div className='relative' ref={dropdownRef}>
          <div
            className='flex cursor-pointer items-center gap-2.5 border-r border-solid border-r-gray-400 pr-6 text-xl font-semibold text-white transition-all duration-200 ease-linear select-none hover:opacity-80'
            onClick={handleDropdownToggle}
          >
            <FaBarsStaggered className='text-light-golden-yellow' />
            Phần {selectedSeason}
            <FaCaretDown />
          </div>
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{
                  opacity: 0.5,
                  scale: 0.8,
                  transformOrigin: '40% -50%'
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0.5,
                  scale: 0.8
                }}
                transition={{ duration: 0.1, ease: 'linear' }}
                className='absolute top-10 z-10 min-w-40 overflow-hidden rounded-md bg-gray-100 pb-2 shadow-lg'
              >
                <h3 className='border-b border-gray-200 px-4 py-2 text-black'>
                  Danh sách phần
                </h3>
                {Array.from({ length: seasonCount }).map((_, index) => (
                  <div
                    key={`season-${index}`}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80',
                      {
                        'bg-light-golden-yellow': index + 1 === selectedSeason
                      }
                    )}
                    onClick={() => handleSelectSeason(index)}
                  >
                    Phần {index + 1}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className='grow'></div>
        <ButtonToggle
          toggle={toggle}
          handleToggle={handleToggle}
          text='Rút gọn'
        />
      </div>
      {/* Body */}
      <motion.div
        layout
        className={cn('grid', {
          'grid-cols-6 gap-x-2.5 gap-y-8': !toggle,
          'grid-cols-8 gap-2.5': toggle
        })}
        transition={{
          layout: { duration: 0.15, ease: 'linear' }
        }}
      >
        {episodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            layout
            transition={{
              layout: { duration: 0.15, ease: 'linear' }
            }}
          >
            <Link
              href={`${route.watch.path}/${movie.slug}.${movie.id}?season=${currentSeason?.label}&episode=${episode.label}`}
              className={cn('block', {
                'bg-episode-1 hover:text-light-golden-yellow flex h-12.5 items-center justify-center gap-2 rounded-sm px-[3.5px]':
                  toggle
              })}
            >
              <motion.div
                layout
                className={cn(
                  'bg-episode-2 group relative mb-2.5 block w-full overflow-hidden rounded-md',
                  {
                    'h-0 pb-[66%]': !toggle,
                    hidden: toggle
                  }
                )}
                transition={{
                  duration: 0.15,
                  ease: 'linear'
                }}
              >
                <div className='group-hover:text-light-golden-yellow border-light-golden-yellow absolute top-1/2 left-1/2 z-3 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-solid bg-[rgba(0,0,0,0.5)] pl-0.5 opacity-0 transition-all duration-200 ease-linear group-hover:opacity-100'>
                  <FaPlay />
                </div>
                <Image
                  src={renderImageUrl(episode.thumbnailUrl)}
                  className='aspect-video h-full w-full border-none object-cover'
                  alt={episode.title}
                  fill
                  sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                />
              </motion.div>
              <div className='flex items-center gap-2.5 text-sm font-medium transition-all duration-200 ease-linear'>
                <div className='block shrink-0 text-xs'>
                  <FaPlay />
                </div>
                <div className='line-clamp-1 block truncate'>
                  Tập {index + 1}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default function MovieTabEpisode({ direction }: { direction: number }) {
  const movie = useMovieStore((s) => s.movie);

  const Tab = movie
    ? movie.type === MOVIE_TYPE_SINGLE
      ? MovieTabEpisodeSingle
      : MovieTabEpisodeSeries
    : null;

  if (!movie) return null;

  return (
    <MotionWrapper uniqueKey={MOVIE_TAB_EPISODE} direction={direction}>
      {Tab && <Tab movie={movie} />}
    </MotionWrapper>
  );
}
