'use client';

import { MOVIE_TYPE_SINGLE } from '@/constants';
import { MovieHistoryResType } from '@/types';
import { motion, Variants, Transition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { route } from '@/routes';
import { formatSecondsToHMS, renderImageUrl } from '@/utils';
import { cn } from '@/lib';
import { X } from 'lucide-react';

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

export default function MovieCardHistory({
  movieHistory,
  dir = 'up',
  onDelete
}: {
  movieHistory: MovieHistoryResType;
  dir?: Dir;
  onDelete?: (id: string) => void;
}) {
  const itemVariants = makeItemVariants(dir);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const movie = movieHistory.movie;

  const movieItem = movieHistory.movieItem;

  const percentWatched =
    (movieHistory.lastWatchSeconds * 100) / movieItem.video.duration;

  const isSingle = movie.type === MOVIE_TYPE_SINGLE;

  const watchLink = isSingle
    ? `${route.watch.path}/${movie.slug}.${movie.id}?season=${movieItem.label}`
    : `${route.watch.path}/${movie.slug}.${movie.id}?season=${movieItem.parent.label}&episode=${movieItem.label}`;

  return (
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
        className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-lg pb-[150%]'
        href={watchLink}
      >
        <Image
          alt={movie.title}
          className='absolute inset-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
          fill
          src={renderImageUrl(movie.posterUrl)}
          unoptimized
          sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
        />
      </Link>

      <div className='min-h-10.5 text-center'>
        <div
          className='relative mb-2 h-1 w-full overflow-hidden rounded-lg bg-white/10'
          title={`Bạn đã xem ${Math.floor(percentWatched)}% phim này`}
        >
          <div
            className='absolute top-0 bottom-0 left-0 h-1 rounded-lg bg-white'
            style={{ width: `${percentWatched}%` }}
          ></div>
        </div>
        <div className='flex flex-col items-center justify-center text-xs text-white/80 [&_div]:leading-5'>
          {/* ClassName to make a dot between time and duration, and make the dot in the middle of the two text */}
          {/*
          className='relative pl-2.5 before:absolute before:top-1/2 before:left-0 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-white before:content-[""]' */}
          <div>
            <span title={formatSecondsToHMS(movieHistory.lastWatchSeconds)}>
              {formatSecondsToHMS(movieHistory.lastWatchSeconds)}
            </span>
            &nbsp;/&nbsp;
            <span
              className='text-white/50'
              title={formatSecondsToHMS(movieItem.video.duration)}
            >
              {formatSecondsToHMS(movieItem.video.duration)}
            </span>
          </div>
          <div>
            {isSingle ? (
              'Tập full'
            ) : (
              <>
                Phần {movieItem.parent.label} - Tập {movieItem.label}
              </>
            )}
          </div>
        </div>
        <Link href={watchLink} title={movie.title}>
          <h4
            className={cn(
              'hover:text-light-golden-yellow line-clamp-1 text-sm leading-5 font-normal text-white transition-all duration-200 ease-linear',
              {
                'featured-title font-bold': movie.isFeatured
              }
            )}
          >
            {movie.title}
          </h4>
        </Link>
        <Link href={watchLink} title={movie.originalTitle}>
          <h4 className='text-light-gray line-clamp-1 text-xs leading-5'>
            {movie.originalTitle}
          </h4>
        </Link>
      </div>

      {onDelete && (
        <button
          aria-label='Remove from favourite'
          className='absolute top-1 right-1 cursor-pointer rounded bg-white p-1 text-black opacity-0 shadow-lg transition-all duration-200 ease-linear group-hover:opacity-100 hover:opacity-80'
          onClick={() => onDelete(movie.id)}
        >
          <X className='size-4' />
        </button>
      )}
    </motion.div>
  );
}
