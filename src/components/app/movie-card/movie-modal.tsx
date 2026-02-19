'use client';

import './movie-modal.css';
import { ageRatings, MOVIE_TYPE_SERIES, MOVIE_TYPE_SINGLE } from '@/constants';
import { Button } from '@/components/form';
import { FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieResType } from '@/types';
import Link from 'next/link';
import { formatDuration, getYearFromDate, renderImageUrl } from '@/utils';
import {
  TagAgeRating,
  TagCategory,
  TagNormal,
  TagWrapper
} from '@/components/app/tag';
import { route } from '@/routes';
import { cn } from '@/lib';
import { ButtonWatchNow } from '@/components/app/button-watch-now';
import { Activity } from '@/components/activity';
import { ButtonLikePopup } from '@/components/app/button-like';

export default function MovieModal({
  movie,
  pos
}: {
  movie: MovieResType;
  pos: { x: number; y: number } | null;
}) {
  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            position: 'absolute',
            zIndex: 50,
            transformOrigin: '50% 50%'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'linear' }}
          className='bg-gunmetal-blue w-full max-w-105 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border-none leading-normal text-white shadow-[0_5px_10px_0_rgba(0,0,0,.2)]'
        >
          <div className='text-sm font-light text-white'>
            <div
              className='image-modal-mask relative bg-cover bg-position-[50%]'
              style={{
                backgroundImage: `url(${renderImageUrl(movie.thumbnailUrl)})`
              }}
            >
              <div className='absolute top-0 right-0 bottom-0 left-0 z-3 flex flex-col items-start justify-end bg-[linear-gradient(20deg,rgba(47,51,70,.6),rgba(47,51,70,0))] p-4' />
              <div className='ratio-16x9 relative w-full before:block before:pt-(--bs-aspect-ratio)' />
            </div>
            <div className='w-full bg-[linear-gradient(0deg,rgba(47,51,70,1),rgba(47,51,70,.7))] p-6 pt-2'>
              <div className='mb-4'>
                <h3
                  className={cn('font-normal text-shadow-[0_0_3px_#00000030]', {
                    'featured-title font-bold': movie.isFeatured
                  })}
                >
                  {movie.title}
                </h3>
                <h3 className='text-light-golden-yellow mb-0 text-xs leading-normal font-normal'>
                  {movie.originalTitle}
                </h3>
              </div>
              <div className='mb-5 flex items-stretch justify-between gap-2.5'>
                <ButtonWatchNow
                  href={`${route.watch.path}/${movie.slug}.${movie.id}`}
                  variant='popup'
                />
                <ButtonLikePopup
                  targetId={movie.id}
                  refetch={!!pos}
                  className='grow'
                />
                <Link
                  href={`${route.movie.path}/${movie.slug}.${movie.id}`}
                  className='block'
                >
                  <Button
                    className='hover:text-light-golden-yellow hover:border-light-golden-yellow w-full border border-white/50 bg-transparent text-white hover:bg-transparent'
                    variant='ghost'
                  >
                    <FaInfoCircle />
                    Chi tiết
                  </Button>
                </Link>
              </div>
              <TagWrapper className='gap-1.25'>
                <TagAgeRating
                  className='flex shrink-0 items-center overflow-hidden rounded bg-white px-2 text-xs leading-5.5 font-medium text-black'
                  value={
                    ageRatings.find((age) => age.value === movie.ageRating)
                      ?.label || 'U'
                  }
                />
                <TagNormal
                  className='bg-transparent-white inline-flex h-5.5 items-center rounded border-none px-1.5 text-xs text-white'
                  value={getYearFromDate(movie.releaseDate)}
                />
                <Activity visible={movie.type === MOVIE_TYPE_SINGLE}>
                  <TagNormal
                    className='bg-transparent-white inline-flex h-5.5 items-center rounded border-none px-1.5 text-xs text-white'
                    value={`Phần ${movie.latestSeason}`}
                  />
                  <TagNormal
                    className='bg-transparent-white inline-flex h-5.5 items-center rounded border-none px-1.5 text-xs text-white'
                    value={formatDuration(movie.duration)}
                  />
                </Activity>
                <Activity visible={movie.type === MOVIE_TYPE_SERIES}>
                  <TagNormal
                    className='bg-transparent-white inline-flex h-5.5 items-center rounded border-none px-1.5 text-xs text-white'
                    value={`Phần ${movie.latestSeason}`}
                  />
                  <TagNormal
                    className='bg-transparent-white inline-flex h-5.5 items-center rounded border-none px-1.5 text-xs text-white'
                    value={`Tập ${movie.latestEpisode}`}
                  />
                </Activity>
              </TagWrapper>
              <TagWrapper className='mt-2 gap-1.25'>
                {movie.categories.map((item, index) => (
                  <TagCategory
                    text={item.name}
                    key={item.id}
                    className={cn({
                      'before:content[""] ml-0.5 before:mr-1.5 before:h-1 before:w-1 before:rounded-full before:bg-white':
                        index > 0
                    })}
                  />
                ))}
              </TagWrapper>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
