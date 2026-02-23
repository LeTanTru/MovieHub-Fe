'use client';

import {
  MOVIE_TAB_ACTOR,
  MOVIE_TAB_DIRECTOR,
  MOVIE_TAB_EPISODE,
  MOVIE_TAB_SUGGESTION,
  MOVIE_TAB_TRAILER,
  movieTabs,
  PERSON_KIND_ACTOR,
  PERSON_KIND_DIRECTOR
} from '@/constants';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib';
import { useRef, useState, useEffect } from 'react';
import MovieTabEpisode from './movie-tab-episode';
import MovieTabPerson from './movie-tab-person';
import MovieTabsSkeleton from './movie-tabs-skeleton';
import MovieTabSuggestion from './movie-tab-suggestion';
import MovieTabTrailer from './movie-tab-trailer';

export default function MovieTabs({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const [activeKey, setActiveKey] = useState<string>(MOVIE_TAB_EPISODE);
  const [direction, setDirection] = useState<number>(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeTab = tabRefs.current[activeKey];
    const container = containerRef.current;

    if (activeTab && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: activeTab.offsetWidth
      });
    }
  }, [activeKey]);

  const handleClick = (key: string) => {
    const currentIndex = movieTabs.findIndex((tab) => tab.key === activeKey);
    const newIndex = movieTabs.findIndex((tab) => tab.key === key);

    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveKey(key);
  };

  const activeTabContent = (() => {
    switch (activeKey) {
      case MOVIE_TAB_EPISODE:
        return <MovieTabEpisode direction={direction} />;
      case MOVIE_TAB_TRAILER:
        return <MovieTabTrailer direction={direction} />;
      case MOVIE_TAB_ACTOR:
        return (
          <MovieTabPerson kind={PERSON_KIND_ACTOR} direction={direction} />
        );
      case MOVIE_TAB_DIRECTOR:
        return (
          <MovieTabPerson kind={PERSON_KIND_DIRECTOR} direction={direction} />
        );
      case MOVIE_TAB_SUGGESTION:
        return <MovieTabSuggestion direction={direction} />;
      default:
        return null;
    }
  })();

  if (isLoading) return <MovieTabsSkeleton />;

  return (
    <div className='flex flex-col gap-x-5 px-10'>
      <div
        ref={containerRef}
        className='relative flex flex-wrap gap-4 border-b border-solid'
        role='tablist'
      >
        {movieTabs.map((tab) => (
          <div
            role='tab'
            key={tab.key}
            ref={(el) => {
              tabRefs.current[tab.key] = el;
            }}
            className={cn(
              'flex cursor-pointer items-center justify-center px-4 py-3 text-sm font-medium text-white opacity-90 transition-opacity duration-200 ease-linear',
              {
                'text-golden-glow opacity-100': tab.key === activeKey
              }
            )}
            onClick={() => handleClick(tab.key)}
          >
            {tab.label}
          </div>
        ))}

        <div
          className='bg-golden-glow absolute -bottom-px h-0.5 rounded transition-all duration-300 ease-in-out'
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            willChange: 'transform, width, position',
            transform: 'translateZ(0)'
          }}
        />
      </div>

      <div role='tabpanel'>
        <AnimatePresence mode='wait'>{activeTabContent}</AnimatePresence>
      </div>
    </div>
  );
}
