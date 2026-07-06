'use client';

import { AnimatePresence, m } from 'framer-motion';
import { ButtonToggle } from '@/components/app/button-toggle';
import { cn } from '@/lib';
import { EpisodeCard } from '@/components/app/episode';
import type { EpisodeResType, MetadataType, MovieResType } from '@/types';
import { FaBarsStaggered, FaCaretDown } from 'react-icons/fa6';
import { MovieTabHeading } from '@/components/app/heading';
import { parseJSON } from '@/utils';
import { route } from '@/routes';
import { ScheduleBadge } from '@/components/app/schedule-badge';
import {
  useClickOutside,
  useNavigate,
  useIsomorphicLayoutEffect
} from '@/hooks';
import { useMemo, useState } from 'react';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

type MovieTabSeriesProps = {
  movie: MovieResType;
};

export function MovieTabSeries({ movie }: MovieTabSeriesProps) {
  const ANIMATION_DURATION = 300;

  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { selectedSeason, setSelectedSeason } = useMovieStore(
    useShallow((s) => ({
      selectedSeason: s.selectedSeason,
      setSelectedSeason: s.setSelectedSeason
    }))
  );

  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

  const latestSeason = metadata?.latestSeason?.label;

  const seasons = useMemo(() => movie.seasons || [], [movie.seasons]);

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

  const handleSelectSeason = (season: string) => {
    setSelectedSeason(season);
    setShowDropdown(false);
  };

  useIsomorphicLayoutEffect(() => {
    if (latestSeason) {
      setSelectedSeason(latestSeason);
    } else if (seasons.length > 0) {
      setSelectedSeason(seasons[seasons.length - 1].label);
    }

    return () => {
      setSelectedSeason('1');
    };
  }, [latestSeason, setSelectedSeason, seasons]);

  const handleEpisodeClick = (episode: EpisodeResType) => {
    navigate.push(
      `${route.watch.path}/${movie.slug}.${movie.id}?season=${currentSeason?.label}&episode=${episode.label}`
    );
  };

  return (
    <>
      <ScheduleBadge />
      {/* Header */}
      <div className='max-640:mb-2 mb-4 flex items-center justify-between'>
        <div className='relative' ref={dropdownRef}>
          {currentSeason ? (
            <button
              type='button'
              className='max-640:border-none max-640:text-sm flex cursor-pointer items-center gap-2.5 border-r border-solid border-r-gray-400 pr-6 text-lg font-semibold text-white transition-all duration-200 ease-linear select-none hover:opacity-80'
              onClick={handleDropdownToggle}
            >
              <FaBarsStaggered className='text-golden-glow' />
              Phần {selectedSeason}
              <FaCaretDown />
            </button>
          ) : (
            <MovieTabHeading className='mb-0' title='Danh sách các phần' />
          )}
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
                {seasons.map((season) => (
                  <button
                    type='button'
                    key={`season-${season.id}`}
                    className={cn(
                      'block flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80',
                      {
                        'bg-golden-glow':
                          season.label === selectedSeason?.toString()
                      }
                    )}
                    onClick={() => handleSelectSeason(season.label)}
                  >
                    Phần {season.label}
                  </button>
                ))}
              </m.div>
            )}
          </AnimatePresence>
        </div>
        {currentSeason && (
          <>
            <div className='grow'></div>
            <ButtonToggle
              toggle={toggle}
              onToggle={handleToggle}
              text='Rút gọn'
              className='max-640:hidden'
            />
          </>
        )}
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
        {episodes.length > 0 &&
          episodes.map((episode, index) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              index={index}
              toggle={toggle}
              onClick={() => handleEpisodeClick(episode)}
            />
          ))}
      </m.div>
      {episodes.length === 0 && (
        <p className='text-accent-foreground'>
          Các phần và tập phim đang được cập nhật
        </p>
      )}
    </>
  );
}
