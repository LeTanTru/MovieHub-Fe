'use client';

import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { ButtonLike } from '@/components/app/button-like';
import { ButtonReview, ButtonViewReview } from '@/components/app/button-review';
import { ButtonShareMovie } from '@/components/app/button-share';
import { ButtonViewComment } from '@/components/app/button-comment';
import { ButtonWatchNow } from '@/components/app/button-watch-now';
import { MOVIE_DETAIL_DISCUSSION_ID } from '@/constants';
import { useMovieInfo } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Video } from 'lucide-react';
import { cn } from '@/lib';

export function MovieActionBar() {
  const { movie, hasTrailer, watchLink } = useMovieInfo();

  if (!movie) return null;

  return (
    <div className='max-1120:py-5 max-1120:px-4 max-800:px-0 max-520:pb-2.5 max-860:px-2.5 relative z-3 p-7.5'>
      <div className='max-1120:gap-6 max-990:gap-2 max-800:flex-col max-800:gap-4 flex items-center justify-between gap-8'>
        {watchLink ? (
          <ButtonWatchNow
            className='max-640:h-12.5 max-640:min-h-auto max-640:p-2 max-800:min-w-55 max-640:min-w-44'
            href={watchLink}
            variant='detail'
          />
        ) : (
          <div
            role='button'
            className='group relative cursor-pointer overflow-hidden rounded-xl text-black hover:shadow-[0_0_24px_6px_rgba(255,207,89,0.3)]'
            style={{
              background:
                'linear-gradient(135deg, #FECF59 0%, #FFE87C 50%, #FFF1CC 100%)',
              boxShadow: '0 4px 14px 0 rgba(254,207,89,0.35)'
            }}
          >
            <div className='pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full' />

            {hasTrailer && (
              <div className='flex items-center justify-center gap-2 px-5 py-2.5 font-bold tracking-wide'>
                <Video size={20} className='fill-black/80' />
                <span className='text-sm'>Xem Trailer</span>
              </div>
            )}

            <div
              className={cn(
                'flex w-full items-center justify-center gap-2 border-t border-black/10 bg-black/8 px-4 py-2 text-xs font-semibold tracking-widest',
                {
                  'border-none bg-transparent px-5 py-3 text-sm': !hasTrailer,
                  'bg-gray-200': hasTrailer
                }
              )}
            >
              {!hasTrailer && <Calendar size={20} className='animate-bounce' />}
              <span>{!hasTrailer ? 'Sắp ra mắt' : 'Phim sắp ra mắt'}</span>
            </div>
          </div>
        )}
        <div className='max-800:gap-4 flex grow items-center justify-between'>
          <div className='max-1120:gap-2 max-800:gap-3 max-640:gap-2 flex grow items-center gap-4'>
            <ButtonLike
              className='max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              targetId={movie.id}
              variant='detail'
            />
            <ButtonAddToPlaylist
              className='max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              movieId={movie.id}
              variant='detail'
            />
            <ButtonShareMovie
              className='max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              variant='detail'
            />
            <ButtonViewComment
              className='max-520:hidden max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              to={MOVIE_DETAIL_DISCUSSION_ID}
              variant='detail'
            />
            <ButtonViewReview
              className='max-520:hidden max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              to={MOVIE_DETAIL_DISCUSSION_ID}
              variant='detail'
            />
          </div>
          <ButtonReview
            movieId={movie.id}
            className='max-640:[&_.rating]:mr-0 max-640:[&_.rating]:font-semibold max-640:[&_.content]:hidden'
          />
        </div>
      </div>
    </div>
  );
}

MovieActionBar.Skeleton = function () {
  return (
    <div className='max-1120:py-5 max-1120:px-4 max-800:px-0 max-520:pb-2.5 max-860:px-2.5 relative z-3 p-7.5'>
      <div className='max-1120:gap-6 max-990:gap-2 max-800:flex-col max-800:gap-4 flex items-center justify-between gap-8'>
        <Skeleton className='skeleton max-640:h-12.5 max-800:min-w-55 max-640:min-w-44 h-15 w-44 rounded-4xl!' />
        <div className='max-800:gap-4 flex grow items-center justify-between'>
          <div className='max-1120:gap-2 max-800:gap-3 max-640:gap-2 flex grow items-center gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`action-skeleton-${index}`}
                className='skeleton max-520:hidden:max-860:min-w-15 max-640:text-[13px] max-520:text-xs size-15 rounded-lg!'
              />
            ))}
          </div>
          <Skeleton className='skeleton max-640:min-w-32 h-12 w-45 rounded-4xl!' />
        </div>
      </div>
    </div>
  );
};
