'use client';

import MoviePersonModal from '@/app/person/_components/movie-person-modal';
import { breakPoints } from '@/constants';
import { cn } from '@/lib';
import { MoviePersonResType } from '@/types';
import { useMediaQuery } from 'react-responsive';

import {
  AnimatePresence,
  motion,
  LayoutGroup,
  Variants,
  Transition
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MovieGridSkeleton from '@/app/person/_components/movie-card-skeleton';
import { route } from '@/routes';
import { renderImageUrl } from '@/utils';

type Dir = 'up' | 'down';

const makeItemVariants = (dir: Dir): Variants => {
  const delta = 10;
  const from = dir === 'down' ? -delta : delta;
  const toExit = dir === 'down' ? delta : -delta;

  return {
    initial: { opacity: 0, y: from, scale: 0.98, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: toExit, scale: 0.98, filter: 'blur(6px)' }
  };
};

const itemTransition: Transition = {
  opacity: { duration: 0.25, ease: [0.0, 0.0, 0.2, 1] },
  default: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }
};

export default function MoviePersonList({
  moviePersonList,
  type = 'all'
}: {
  moviePersonList: MoviePersonResType[];
  type: string;
}) {
  return (
    <LayoutGroup>
      <AnimatePresence mode='wait'>
        <motion.div
          key={type}
          initial={{ opacity: 0, y: type === 'all' ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: type === 'all' ? -10 : 10 }}
        >
          {moviePersonList.length === 0 ? (
            <MovieGridSkeleton />
          ) : type === 'all' ? (
            <MovieGrid moviePersonList={moviePersonList} dir='down' />
          ) : (
            <MovieGridByYear moviePersonList={moviePersonList} />
          )}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}

function MovieCard({ mp, dir }: { mp: MoviePersonResType; dir: Dir }) {
  const itemVariants = makeItemVariants(dir);
  const isDesktop = useMediaQuery({
    query: `(min-width: ${breakPoints.desktop}px)`
  });
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const cardRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const openModal = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2 + scrollY;
    setModalPos({ x: centerX, y: centerY });
  };

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(openModal, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    hoverTimeout.current = setTimeout(() => {
      setModalPos(null);
    }, 200);
  };

  return (
    <div className='relative'>
      <motion.div
        key={mp.id}
        ref={cardRef}
        layout
        variants={itemVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={itemTransition}
        className='relative flex flex-col gap-3'
      >
        <Link
          className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-xl pb-[150%]'
          href={`${route.movie}/${mp.movie.slug}.${mp.movie.id}`}
          onPointerEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (hoverTimeout.current) {
              clearTimeout(hoverTimeout.current);
              hoverTimeout.current = null;
            }
            setModalPos(null);
          }}
        >
          <Image
            fill
            src={renderImageUrl(mp.movie.thumbnailUrl)}
            alt={mp.movie.title}
            className='absolute inset-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
          />
        </Link>

        <div className='min-h-10.5 text-center'>
          <h4 className='hover:text-light-golden-yellow mb-0 line-clamp-1 text-sm leading-6 font-normal text-white transition-all duration-200 ease-linear'>
            <Link href={`${route.movie}/${mp.movie.slug}.${mp.movie.id}`}>
              {mp.movie.title}
            </Link>
          </h4>
          <h4 className='text-light-gray mt-[5px] line-clamp-1 text-xs leading-6'>
            <Link href={`${route.movie}/${mp.movie.slug}.${mp.movie.id}`}>
              {mp.movie.originalTitle}
            </Link>
          </h4>
        </div>
      </motion.div>

      {isDesktop &&
        createPortal(
          <div
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            }}
            onMouseLeave={() => setModalPos(null)}
          >
            <MoviePersonModal mp={mp} pos={modalPos} />
          </div>,
          document.body
        )}
    </div>
  );
}

function groupByYear(list: MoviePersonResType[]) {
  return list.reduce((acc: Record<string, MoviePersonResType[]>, mp) => {
    const year = mp.movie.releaseDate?.split(' ')[0].split('/')[2];
    if (!year) return acc;
    if (!acc[year]) acc[year] = [];
    acc[year].push(mp);
    return acc;
  }, {});
}

function MovieGridByYear({
  moviePersonList
}: {
  moviePersonList: MoviePersonResType[];
}) {
  const grouped = groupByYear(moviePersonList);

  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((year, index) => (
      <div
        key={year}
        className={cn(
          'max-1120:ml-0 max-1120:flex-col max-1120:justify-center max-1120:gap-4 max-800:gap-2 relative -ml-10 flex items-start justify-start',
          { 'max-1120:mt-4 mt-12': index > 0 }
        )}
      >
        <div className='before:bg-light-golden-yellow max-1120:h-auto max-1120:before:top-1 relative z-2 h-20 w-20 shrink-0 text-center font-semibold text-white before:absolute before:top-0 before:-left-[5px] before:h-2.5 before:w-2.5 before:rounded-full before:content-[""]'>
          <span className='max-1120:rotate-0 max-1120:justify-start max-1120:text-2xl max-1120:text-white max-1120:opacity-80 flex h-full w-full -rotate-90 items-center justify-end pl-4 text-[40px] font-black tracking-[3px] opacity-20'>
            {year}
          </span>
        </div>

        <div className='max-1120:grid-cols-5 max-1360:grid-cols-4 max-1600:grid-cols-5 max-1600:gap-4 max-480:grid-cols-2 max-800:grid-cols-4 relative z-3 grid w-full grow grid-cols-6 gap-6 gap-x-4 gap-y-6 max-sm:grid-cols-3'>
          <AnimatePresence mode='popLayout' initial={false}>
            {grouped[year].map((mp) => (
              <MovieCard key={mp.id} mp={mp} dir='up' />
            ))}
          </AnimatePresence>
        </div>
      </div>
    ));
}

function MovieGrid({
  moviePersonList,
  dir
}: {
  moviePersonList: MoviePersonResType[];
  dir: Dir;
}) {
  return (
    <div className='max-1120:grid-cols-5 max-1360:grid-cols-4 max-1600:grid-cols-5 max-1600:gap-4 max-480:grid-cols-2 max-800:grid-cols-4 grid grid-cols-6 gap-6 max-sm:grid-cols-3'>
      <AnimatePresence mode='popLayout' initial={false}>
        {moviePersonList &&
          moviePersonList.map((mp) => (
            <MovieCard key={mp.id} mp={mp} dir={dir} />
          ))}
      </AnimatePresence>
    </div>
  );
}
