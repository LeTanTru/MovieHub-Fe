'use client';

import './top-movie-card.css';
import { MetadataType, MovieResType } from '@/types';
import { motion, Variants, Transition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { route } from '@/routes';
import { getYearFromDate, parseJSON, renderImageUrl } from '@/utils';
import { useIsMounted } from '@/hooks';
import { cn } from '@/lib';
import { ageRatings, MOVIE_TYPE_SERIES } from '@/constants';
import { MovieModal } from '@/components/app/movie-card';

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

const MODAL_WIDTH = 400;
const EDGE_PADDING = 20;

export default function TopMovieCard({
  movie,
  dir = 'up',
  index
}: {
  movie: MovieResType;
  dir?: Dir;
  index: number;
}) {
  const isMounted = useIsMounted();
  const itemVariants = makeItemVariants(dir);
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const cardRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const openModal = () => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const viewportWidth = window.innerWidth;

    let centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2 + scrollY;

    const modalLeftEdge = centerX - MODAL_WIDTH / 2;
    if (modalLeftEdge < EDGE_PADDING) {
      centerX = MODAL_WIDTH / 2 + EDGE_PADDING;
    }

    const modalRightEdge = centerX + MODAL_WIDTH / 2;
    if (modalRightEdge > viewportWidth - EDGE_PADDING) {
      centerX = viewportWidth - MODAL_WIDTH / 2 - EDGE_PADDING;
    }

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

  const ageRating = ageRatings.find((age) => movie?.ageRating === age.value);
  const isSeries = movie.type === MOVIE_TYPE_SERIES;

  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

  const latestSeason = metadata?.latestSeason;
  const latestEpisode = metadata?.latestEpisode;
  const releaseYear = getYearFromDate(
    latestSeason?.releaseDate || movie.releaseDate
  );

  return (
    <>
      <motion.div
        key={movie.id}
        ref={cardRef}
        variants={itemVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={itemTransition}
        className='group relative flex flex-col gap-3'
      >
        <Link
          className='top-movie-card relative block h-0 w-full overflow-hidden rounded-md pb-[150%] transition-all duration-200 ease-linear'
          href={`${route.movie.path}/${movie.slug}.${movie.id}`}
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
          <div
            className={cn(
              'mask absolute inset-0 bg-transparent transition-all duration-200 ease-linear',
              {
                left: index % 2 === 0,
                right: index % 2 !== 0
              }
            )}
          ></div>
          <Image
            alt={`${movie.title} - ${movie.originalTitle}`}
            className={cn(
              'image absolute h-full w-full object-cover transition-all duration-200 ease-linear',
              {
                left: index % 2 === 0,
                right: index % 2 !== 0
              }
            )}
            fill
            src={renderImageUrl(movie.posterUrl)}
            unoptimized
            sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
          />
        </Link>

        <div className='relative flex min-h-10.5 gap-2'>
          <div
            className={cn(
              'from-golden-glow to-golden-tainoi max-640:text-[28px] max-640:text-center max-640:min-w-7.5 min-w-12.5 shrink-0 bg-linear-[135deg] bg-clip-text text-left text-[58px] leading-none font-extrabold text-transparent italic',
              {
                'min-w-18': (index + 1).toString().length > 1
              }
            )}
          >
            {index + 1}
          </div>
          <div>
            <h4
              className={cn(
                'hover:text-golden-glow max-640:mb-0 mb-1 line-clamp-1 font-normal text-white transition-colors duration-200 ease-linear',
                {
                  'featured-title font-bold': movie.isFeatured
                }
              )}
            >
              <Link
                href={`${route.movie.path}/${movie.slug}.${movie.id}`}
                title={movie.title}
              >
                {movie.title}
              </Link>
            </h4>
            <h4 className='text-dark-gray max-640:mb-0 mb-1.25 line-clamp-1 text-xs leading-5.5 transition-colors duration-200 ease-linear hover:text-white'>
              <Link
                href={`${route.movie.path}/${movie.slug}.${movie.id}`}
                title={movie.originalTitle}
              >
                {movie.originalTitle}
              </Link>
            </h4>
            <div className='flex items-center gap-4'>
              <div
                className='text-dark-gray inline text-xs whitespace-nowrap'
                title={ageRating?.mean}
              >
                <strong>{ageRating?.label}</strong>
              </div>
              <div className='text-dark-gray relative inline text-xs whitespace-nowrap before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
                {releaseYear}
              </div>
              {latestSeason?.label !== '1' && (
                <div className='text-dark-gray relative inline text-xs whitespace-nowrap before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
                  Phần {latestSeason?.label}
                </div>
              )}
              {isSeries && (
                <div className='text-dark-gray relative inline text-xs whitespace-nowrap before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
                  Tập {latestEpisode?.label}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {isMounted &&
        createPortal(
          <div
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            }}
            onMouseLeave={() => setModalPos(null)}
          >
            <MovieModal movie={movie} pos={modalPos} />
          </div>,
          document.body
        )}
    </>
  );
}
