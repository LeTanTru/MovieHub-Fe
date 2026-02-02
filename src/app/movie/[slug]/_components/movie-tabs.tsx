'use client';

import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { PersonCard } from '@/components/app/person-card';
import { NoData } from '@/components/no-data';
import { PERSON_ACTOR, PERSON_DIRECTOR } from '@/constants';
import { cn } from '@/lib';
import { useSuggestionMovieListQuery } from '@/queries';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { getIdFromSlug, renderImageUrl } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';

const MotionWrapper = ({
  children,
  uniqueKey,
  direction
}: {
  children: ReactNode;
  uniqueKey?: string;
  direction: number;
}) => {
  return (
    <motion.div
      key={uniqueKey}
      initial={{ opacity: 0, x: direction * 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='py-10'
    >
      {children}
    </motion.div>
  );
};

const MovieTabEpisode = ({ direction }: { direction: number }) => {
  const { movie, movieItems } = useMovieStore();

  return (
    <MotionWrapper uniqueKey='episode' direction={direction}>
      <div className='space-y-4'>
        <h3 className='mb-8 text-2xl font-semibold text-white'>
          Các bản chiếu
        </h3>
        {movieItems && movieItems.length > 0 ? (
          <div className='grid grid-cols-3 gap-4'>
            {movieItems.map((movieItem) => (
              <Link
                href={`${route.watch.path}/${movie?.slug}.${movie?.id}`}
                key={movieItem.id}
                className='bg-episode-background relative w-full max-w-137.5 overflow-hidden rounded-lg text-white transition-all duration-200 ease-linear hover:-translate-y-1'
              >
                <div className='absolute top-0 right-0 bottom-0 w-2/5 max-w-32.5 mask-[linear-gradient(270deg,black_0,transparent_95%)]'>
                  <Image
                    src={renderImageUrl(movie?.thumbnailUrl)}
                    alt={`${movie?.title} - ${movie?.originalTitle}`}
                    fill
                    className='object-cover'
                    sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                    priority={false}
                  />
                </div>
                <div className='flex-start relative z-2 flex w-9/10 flex-col justify-center gap-4 p-6'>
                  <div className='inline-flex items-center gap-2'>
                    {/* <div className=''></div> */}
                    <span>Phụ đề</span>
                  </div>
                  <div className='text-base leading-normal font-semibold'>
                    {movie?.title}
                  </div>
                  <div className='ease-linea inline-flex min-h-7.5 w-fit items-center justify-center rounded-sm bg-white px-3 py-2 text-xs font-medium text-black transition-all duration-200 hover:opacity-80'>
                    Xem bản này
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className='text-gray-400'>Chưa có tập phim nào</p>
        )}
      </div>
    </MotionWrapper>
  );
};

const MovieTabPerson = ({
  kind,
  direction
}: {
  kind: number;
  direction: number;
}) => {
  const { moviePersons } = useMovieStore();

  const personList = moviePersons
    .filter((moviePerson) => moviePerson.kind === kind)
    .map((moviePerson) => moviePerson.person);

  const titleMaps: Record<number, string> = {
    [PERSON_ACTOR]: 'Diễn viên',
    [PERSON_DIRECTOR]: 'Đạo diễn'
  };

  return (
    <MotionWrapper uniqueKey={`person-${kind}`} direction={direction}>
      <h3 className='mb-8 text-lg leading-normal font-semibold text-white'>
        {titleMaps[kind]}
      </h3>
      <div className='grid grid-cols-6 gap-6'>
        {personList.map((person) => (
          <PersonCard
            person={person}
            key={`tab-item-actor-${person.id}`}
            showFullName
          />
        ))}
      </div>
    </MotionWrapper>
  );
};

const MovieTabSuggestion = ({ direction }: { direction: number }) => {
  const { slug } = useParams<{ slug: string }>();
  const movieId = getIdFromSlug(slug as string);

  const {
    data: suggestionMovieListData,
    isLoading: suggestionMovieListLoading
  } = useSuggestionMovieListQuery({
    id: movieId
  });

  const suggestionMovieList = suggestionMovieListData?.data || [];

  return (
    <MotionWrapper uniqueKey='suggestion' direction={direction}>
      <h3 className='mb-8 text-lg font-semibold'>Phim đề xuất</h3>
      {suggestionMovieListLoading ? (
        <MovieGridSkeleton className='grid-cols-6' />
      ) : suggestionMovieList.length === 0 ? (
        <NoData />
      ) : (
        <MovieGrid movieList={suggestionMovieList} className='grid-cols-6' />
      )}
    </MotionWrapper>
  );
};

export default function MovieTabs() {
  const movieTabs = useMemo(
    () => [
      {
        key: 'episode',
        label: 'Tập phim'
      },
      {
        key: 'actor',
        label: 'Diễn viên'
      },
      {
        key: 'director',
        label: 'Đạo diễn'
      },
      {
        key: 'suggestion',
        label: 'Đề xuất'
      }
    ],
    []
  );

  const [activeKey, setActiveKey] = useState<string>(movieTabs[0].key);
  const [direction, setDirection] = useState<number>(1);
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

  const handleClick = useCallback(
    (key: string) => {
      const currentIndex = movieTabs.findIndex((tab) => tab.key === activeKey);
      const newIndex = movieTabs.findIndex((tab) => tab.key === key);

      setDirection(newIndex > currentIndex ? 1 : -1);
      setActiveKey(key);
    },
    [activeKey, movieTabs]
  );

  const activeTabContent = useMemo(() => {
    switch (activeKey) {
      case 'episode':
        return <MovieTabEpisode direction={direction} />;
      case 'actor':
        return <MovieTabPerson kind={PERSON_ACTOR} direction={direction} />;
      case 'director':
        return <MovieTabPerson kind={PERSON_DIRECTOR} direction={direction} />;
      case 'suggestion':
        return <MovieTabSuggestion direction={direction} />;
      default:
        return null;
    }
  }, [activeKey, direction]);

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
                'text-light-golden-yellow opacity-100': tab.key === activeKey
              }
            )}
            onClick={() => handleClick(tab.key)}
          >
            {tab.label}
          </div>
        ))}

        <div
          className='bg-light-golden-yellow absolute -bottom-px h-0.5 rounded transition-all duration-300 ease-in-out'
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
