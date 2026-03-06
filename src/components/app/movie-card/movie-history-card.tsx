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

export default function MovieHistoryCard({
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
      className='relative flex flex-col gap-3'
    >
      <Link
        className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[150%]'
        href={watchLink}
      >
        <Image
          alt={`${movie.title} - ${movie.originalTitle}`}
          className='absolute inset-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
          fill
          src={renderImageUrl(movie.posterUrl)}
          unoptimized
          sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
        />
      </Link>

      <div className='min-h-10.5 text-center'>
        <div
          className='relative mb-2 h-1 w-full overflow-hidden rounded-md bg-white/10'
          title={`Bạn đã xem ${Math.floor(percentWatched)}% phim này`}
        >
          <div
            className='absolute top-0 bottom-0 left-0 h-1 rounded-tl-md rounded-bl-md bg-white'
            style={{ width: `${percentWatched}%` }}
          ></div>
        </div>
        <div className='text-dark-gray flex flex-col items-center justify-center text-xs [&_div]:leading-5'>
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
        <h4
          className={cn(
            'hover:text-golden-glow line-clamp-1 text-sm leading-5 font-normal text-white transition-all duration-200 ease-linear',
            {
              'featured-title': movie.isFeatured
            }
          )}
        >
          <Link href={watchLink} title={movie.title}>
            {movie.title}&nbsp;
            {movieItem?.parent?.label !== '1' && movieItem?.parent?.label}
          </Link>
        </h4>
        <h4 className='text-dark-gray line-clamp-1 text-xs leading-5 transition-colors duration-200 ease-linear hover:text-white'>
          <Link href={watchLink} title={movie.originalTitle}>
            {movie.originalTitle}&nbsp;
            {movieItem?.parent?.label !== '1' && movieItem?.parent?.label}
          </Link>
        </h4>
      </div>

      {onDelete && (
        <button
          aria-label='Remove from favourite'
          className='absolute top-1 right-1 cursor-pointer rounded bg-white p-1 text-black shadow-md transition-all duration-200 ease-linear'
          onClick={() => onDelete(movie.id)}
        >
          <X className='size-4' />
        </button>
      )}
    </motion.div>
  );
}
