'use client';

import { ButtonToggle } from '@/components/app/button-toggle';
import { useClickOutside, useNavigate, useQueryParams } from '@/hooks';
import { cn } from '@/lib';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { MetadataType } from '@/types';
import { notify, parseJSON, renderImageUrl } from '@/utils';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaBarsStaggered, FaCaretDown, FaPlay } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';

export default function WatchSeries() {
  const ANIMATION_DURATION = 300;

  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();

  const { movie, selectedSeason, setSelectedSeason } = useMovieStore(
    useShallow((s) => ({
      movie: s.movie,
      selectedSeason: s.selectedSeason,
      setSelectedSeason: s.setSelectedSeason
    }))
  );

  const metadata = parseJSON<MetadataType>(movie?.metadata || '{}');
  const latestSeason = metadata?.latestSeason?.label;

  const seasons = movie?.seasons || [];
  const seasonCount = seasons.length;

  const currentSeason = seasons.find(
    (season) => season.label === selectedSeason.toString()
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
    setSelectedSeason((index + 1).toString());
    setShowDropdown(false);
  };

  useEffect(() => {
    if (searchParams.season) {
      setSelectedSeason(searchParams.season);
    } else {
      setSelectedSeason(latestSeason ? latestSeason : '1');
    }
  }, [latestSeason, searchParams.season, setSelectedSeason]);

  if (!movie) return null;

  const handleEpisodeClick = (episode: (typeof episodes)[0]) => {
    if (episode.label === searchParams.episode) {
      notify.info('Bản này đang được phát');
      return;
    }
    navigate.replace(
      `${route.watch.path}/${movie.slug}.${movie.id}?season=${currentSeason?.label}&episode=${episode.label}`
    );
  };

  return (
    <LazyMotion features={domAnimation}>
      <>
        {/* Header */}
        <div className='max-1120:mb-4 max-640:mb-3 mb-6 flex items-center justify-between'>
          <div className='relative' ref={dropdownRef}>
            <div
              className='max-640:border-none max-640:text-lg max-480:text-base flex cursor-pointer items-center gap-2.5 border-r border-solid border-r-gray-400 pr-6 text-xl font-semibold text-white transition-all duration-200 ease-linear select-none hover:opacity-80'
              onClick={handleDropdownToggle}
            >
              <FaBarsStaggered className='text-golden-glow' />
              Phần {selectedSeason}
              <FaCaretDown />
            </div>
            <AnimatePresence>
              {showDropdown && (
                <m.div
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
                          'bg-golden-glow':
                            (index + 1).toString() === selectedSeason
                        }
                      )}
                      onClick={() => handleSelectSeason(index)}
                    >
                      Phần {index + 1}
                    </div>
                  ))}
                </m.div>
              )}
            </AnimatePresence>
          </div>
          <div className='grow'></div>
          <ButtonToggle
            toggle={toggle}
            handleToggle={handleToggle}
            text='Rút gọn'
            className='max-640:hidden'
          />
        </div>
        {/* Body */}
        <m.div
          layout
          className={cn('grid translate-z-0 will-change-transform', {
            'max-1360:grid-cols-5 max-1360:gap-y-6 max-800:grid-cols-4 max-640:grid-cols-3 max-520:grid-cols-2 max-640:gap-y-4 grid-cols-6 gap-x-2.5 gap-y-8':
              !toggle,
            'max-1360:grid-cols-6 max-800:grid-cols-5 max-640:grid-cols-4 max-520:grid-cols-3 max-480:grid-cols-2 grid-cols-8 gap-2.5':
              toggle
          })}
          transition={{
            layout: { duration: 0.15, ease: 'linear' }
          }}
        >
          {episodes.map((episode, index) => {
            const isPlaying =
              episode.label === searchParams.episode &&
              currentSeason?.label === searchParams.season;
            return (
              <m.div
                key={episode.id}
                layout
                transition={{
                  layout: { duration: 0.15, ease: 'linear' }
                }}
                className='translate-z-0 will-change-transform'
              >
                <button
                  onClick={() => handleEpisodeClick(episode)}
                  className={cn(
                    'group block w-full cursor-pointer transition-all duration-200 ease-linear',
                    {
                      'bg-charade hover:text-golden-glow max-640:h-10.5 flex h-12.5 items-center justify-center gap-2 rounded-sm px-[3.5px]':
                        toggle,
                      'bg-golden-glow hover:bg-golden-glow/85 text-black hover:text-black/80':
                        isPlaying && toggle
                    }
                  )}
                >
                  <m.div
                    layout
                    className={cn(
                      'bg-gunmetal-blue relative mb-2.5 block w-full translate-z-0 overflow-hidden rounded-md will-change-transform',
                      {
                        'h-0 pb-[66%]': !toggle,
                        'border-golden-glow border-2 border-solid':
                          isPlaying && !toggle,
                        hidden: toggle
                      }
                    )}
                    transition={{
                      duration: 0.15,
                      ease: 'linear'
                    }}
                  >
                    <div className='group-hover:text-golden-glow border-golden-glow absolute top-1/2 left-1/2 z-3 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-solid bg-[rgba(0,0,0,0.5)] opacity-0 transition-all duration-200 ease-linear group-hover:opacity-100'>
                      <FaPlay />
                    </div>
                    <Image
                      src={renderImageUrl(episode.thumbnailUrl)}
                      className='aspect-video h-full w-full border-none object-cover'
                      alt={episode.title}
                      fill
                      sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                    />
                    {isPlaying && !toggle && (
                      <div className='bg-golden-glow absolute bottom-0 left-0 rounded-tr-sm px-1.5 py-0.75 text-xs text-black'>
                        Đang chiếu
                      </div>
                    )}
                  </m.div>
                  <div
                    className={cn(
                      'group-hover:text-golden-glow max-640:gap-1 max-640:text-[13px] max-520:text-xs flex items-center gap-2.5 text-sm font-medium transition-all duration-200 ease-linear',
                      {
                        'text-golden-glow': isPlaying && !toggle
                      }
                    )}
                  >
                    <div className='block shrink-0 text-xs'>
                      <FaPlay />
                    </div>
                    <div className='line-clamp-1 block truncate'>
                      Tập {index + 1}
                    </div>
                  </div>
                </button>
              </m.div>
            );
          })}
        </m.div>
      </>
    </LazyMotion>
  );
}
