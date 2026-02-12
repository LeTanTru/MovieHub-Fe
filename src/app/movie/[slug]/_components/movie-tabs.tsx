'use client';

import TrailerModal from './trailer-modal';
import { getAnonymousToken } from '@/app/actions/anonymous';
import { caption } from '@/assets';
import { ButtonToggle } from '@/components/app/button-toggle';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { PersonCard } from '@/components/app/person-card';
import { CircleLoading } from '@/components/loading';
import { logger } from '@/logger';
import {
  MOVIE_TAB_ACTOR,
  MOVIE_TAB_DIRECTOR,
  MOVIE_TAB_EPISODE,
  MOVIE_TAB_SUGGESTION,
  MOVIE_TAB_TRAILER,
  MOVIE_TYPE_SINGLE,
  movieTabPersonTitles,
  movieTabs,
  PERSON_KIND_ACTOR,
  PERSON_KIND_DIRECTOR
} from '@/constants';
import { useClickOutside, useDisclosure } from '@/hooks';
import { cn } from '@/lib';
import { useSuggestionMovieListQuery } from '@/queries';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { MovieResType } from '@/types';
import { getIdFromSlug, notify, renderImageUrl } from '@/utils';
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
import { FaBarsStaggered, FaCaretDown, FaPlay } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';
import { Skeleton } from '@/components/ui/skeleton';

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
      transition={{ duration: 0.2, ease: 'linear' }}
      className='py-10'
    >
      {children}
    </motion.div>
  );
};

const MovieTabsSkeleton = () => {
  return (
    <div className='flex flex-col gap-x-5 px-10'>
      <div className='flex flex-wrap gap-4 border-b border-solid pb-2'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={`tab-skeleton-${index}`}
            className='skeleton h-8 w-24 rounded'
          />
        ))}
      </div>
      <div className='py-10'>
        <Skeleton className='skeleton mb-4 h-6 w-40 rounded' />
        <div className='grid grid-cols-6 gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={`tab-content-skeleton-${index}`}
              className='skeleton h-28 w-full rounded'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

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

  const currentSeason = useMemo(() => {
    return seasons.find((season) => season.ordering + 1 === selectedSeason);
  }, [seasons, selectedSeason]);

  const episodes = useMemo(() => {
    return currentSeason?.episodes || [];
  }, [currentSeason]);

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
              className='absolute top-10 z-10 min-w-40 overflow-hidden rounded-lg bg-gray-100 pb-2 shadow-lg'
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
          'grid-cols-8 gap-2': toggle
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
                'bg-episode-1 flex h-12.5 items-center justify-center gap-2 rounded-sm px-[3.5px]':
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
                <div className='group-hover:text-light-golden-yellow border-light-golden-yellow absolute top-1/2 left-1/2 z-3 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3rem] border border-solid bg-[rgba(0,0,0,0.5)] pl-0.5 opacity-0 transition-all duration-200 ease-linear group-hover:opacity-100'>
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
              <div className='hover:text-light-golden-yellow flex items-center gap-2.5 text-sm font-medium text-white transition-all duration-200 ease-linear'>
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

const MovieTabEpisode = ({ direction }: { direction: number }) => {
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
};

const MovieTabTrailer = ({ direction }: { direction: number }) => {
  const [toggle, setToggle] = useState(true);
  const { opened, open, close } = useDisclosure();
  const [isFetching, setIsFetching] = useState(false);
  const [token, setToken] = useState<string>('');

  const movie = useMovieStore((s) => s.movie);
  const selectedSeason = useMovieStore((s) => s.selectedSeason);

  const currentSeason = movie?.seasons?.find(
    (season) => season.ordering + 1 === selectedSeason
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
            'grid-cols-8 gap-2': toggle
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
                'bg-episode-1 flex h-12.5 items-center justify-center gap-2 rounded-sm px-[3.5px]':
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
                <div className='group-hover:text-light-golden-yellow border-light-golden-yellow absolute top-1/2 left-1/2 z-3 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3rem] border border-solid bg-[rgba(0,0,0,0.5)] pl-0.5 opacity-0 transition-all duration-200 ease-linear group-hover:opacity-100'>
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
};

const MovieTabPerson = ({
  kind,
  direction
}: {
  kind: number;
  direction: number;
}) => {
  const moviePersons = useMovieStore((s) => s.moviePersons);

  const personList = useMemo(() => {
    return moviePersons
      .filter((moviePerson) => moviePerson.kind === kind)
      .map((moviePerson) => moviePerson.person);
  }, [kind, moviePersons]);

  const title = movieTabPersonTitles[kind];

  return (
    <MotionWrapper
      uniqueKey={
        kind === PERSON_KIND_ACTOR ? MOVIE_TAB_ACTOR : MOVIE_TAB_DIRECTOR
      }
      direction={direction}
    >
      <h3 className='mb-8 text-lg leading-normal font-semibold text-white'>
        {title}
      </h3>
      <div
        className={cn('grid gap-6', {
          'grid-cols-6': personList.length > 0
        })}
      >
        {personList.length === 0 ? (
          <p className='text-gray-400'>
            Danh sách {title.toLowerCase()} trống. Vui lòng chờ cập nhật.
          </p>
        ) : (
          personList.map((person) => (
            <PersonCard
              person={person}
              key={`tab-item-actor-${person.id}`}
              showFullName
              willNavigate
              params={{ kind }}
            />
          ))
        )}
      </div>
    </MotionWrapper>
  );
};

const MovieTabSuggestion = ({ direction }: { direction: number }) => {
  const { slug } = useParams<{ slug: string }>();
  const movieId = getIdFromSlug(slug);

  const {
    data: suggestionMovieListData,
    isLoading: suggestionMovieListLoading
  } = useSuggestionMovieListQuery(movieId);

  const suggestionMovieList = suggestionMovieListData?.data || [];

  return (
    <MotionWrapper uniqueKey={MOVIE_TAB_SUGGESTION} direction={direction}>
      <h3 className='mb-8 text-lg font-semibold'>
        {suggestionMovieList.length === 0 ? 'Đề xuất' : 'Có thể bạn sẽ thích'}
      </h3>
      {suggestionMovieListLoading ? (
        <MovieGridSkeleton className='grid-cols-6' />
      ) : suggestionMovieList.length === 0 ? (
        <p className='text-gray-400'>Danh sách đề xuất trống</p>
      ) : (
        <MovieGrid movieList={suggestionMovieList} className='grid-cols-6' />
      )}
    </MotionWrapper>
  );
};

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

  const handleClick = useCallback(
    (key: string) => {
      const currentIndex = movieTabs.findIndex((tab) => tab.key === activeKey);
      const newIndex = movieTabs.findIndex((tab) => tab.key === key);

      setDirection(newIndex > currentIndex ? 1 : -1);
      setActiveKey(key);
    },
    [activeKey]
  );

  const activeTabContent = useMemo(() => {
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
  }, [activeKey, direction]);

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
