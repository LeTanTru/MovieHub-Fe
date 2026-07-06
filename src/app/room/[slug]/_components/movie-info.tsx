'use client';

import { MovieProgress } from '@/components/app/movie-progress';
import {
  TagAgeRating,
  TagCategoryLink,
  TagImdb,
  TagNormal,
  TagWrapper
} from '@/components/app/tag';
import { ageRatings, MOVIE_TYPE_SERIES, MOVIE_TYPE_SINGLE } from '@/constants';
import { useAuth } from '@/hooks';
import { useMovieItemQuery, useMovieQuery } from '@/queries';
import { route } from '@/routes';
import { useRoomStore } from '@/store';
import type { MetadataType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  formatDuration,
  getYearFromDate,
  parseJSON,
  renderImageUrl
} from '@/utils';
import Image from 'next/image';

export function MovieInfo() {
  const { isAuthenticated } = useAuth();
  const room = useRoomStore((state) => state.room);

  const { data: movieData, isLoading: isMovieLoading } = useMovieQuery(
    room?.movieItem?.movie?.id || ''
  );

  const movie = movieData?.data;

  const { data: movieItem, isLoading: isMovieItemLoading } = useMovieItemQuery({
    id: room?.movieItem?.id || '',
    enabled: isAuthenticated && !!room?.movieItem?.id
  });

  if (!room) return <MovieInfo.Skeleton />;

  if (isMovieLoading || isMovieItemLoading) return <MovieInfo.Skeleton />;

  if (!movie || !movieItem) return null;

  const isSingle = movie.type === MOVIE_TYPE_SINGLE;

  const isSeries = movie.type === MOVIE_TYPE_SERIES;

  const ageRating = ageRatings.find(
    (age) => age.value === movie.ageRating
  )?.label;

  const releaseYear = getYearFromDate(movie.releaseDate);

  const duration = movieItem.video?.duration;

  const categories = movieItem.movie?.categories || [];

  const season = movieItem.parent?.label || movieItem.label;

  const episode = movieItem.label;

  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

  const currentSeason = movie.seasons?.find(
    (season) => season.label === metadata?.latestSeason?.label?.toString()
  );

  const episodes = currentSeason?.episodes || [];

  const isComplete =
    episodes.length > 0 && currentSeason?.totalEpisode === episodes.length;

  return (
    <div className='border-light-gray max-800:hidden relative border-t border-white/13 px-2 py-4'>
      <div className='mx-auto flex w-full max-w-375 items-stretch justify-between gap-8 p-6'>
        <div className='flex w-130 items-start gap-4'>
          <div className='w-30 shrink-0'>
            <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[150%]'>
              <Image
                src={renderImageUrl(movie?.posterUrl)}
                alt={`${movie?.title} - ${movie?.originalTitle}`}
                fill
                className='absolute inset-0 size-full object-cover'
              />
            </div>
          </div>
          <div>
            <div className='mb-2 text-2xl leading-normal font-semibold text-white'>
              {movie.title}
            </div>
            <div className='text-dark-gray mb-4'>{movie.originalTitle}</div>

            <TagWrapper className='mb-3'>
              {movie.imdbRating && <TagImdb value={movie.imdbRating} />}
              {ageRating && <TagAgeRating value={ageRating} />}
              <TagNormal value={releaseYear} />
              {/* Single movie */}
              {isSingle && !!duration && (
                <TagNormal value={formatDuration(duration)} />
              )}
              {/* Series movie */}
              {isSeries && (
                <>
                  {!!season && <TagNormal value={`Phần ${season}`} />}
                  {!!episode && <TagNormal value={`Tập ${episode}`} />}
                  {!!duration && <TagNormal value={formatDuration(duration)} />}
                </>
              )}
              {isSeries && isComplete && (
                <TagNormal
                  value={`Hoàn tất ${room.movieItem.season.totalEpisode} / ${room.movieItem.season.totalEpisode} tập`}
                />
              )}
            </TagWrapper>
            <TagWrapper className='mb-3'>
              {categories.map((category) => (
                <TagCategoryLink
                  key={category.id}
                  href={`${route.category.path}/${category.slug}.${category.id}`}
                  text={category.name}
                />
              ))}
            </TagWrapper>
            {isSeries && (
              <MovieProgress
                currentTotalEpisode={episodes?.length || 0}
                isComplete={isComplete}
                totalEpisode={currentSeason?.totalEpisode || 0}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

MovieInfo.Skeleton = function MovieInfoSkeleton() {
  return (
    <div className='border-light-gray max-800:hidden relative border-t border-white/13 px-2 py-4'>
      <div className='mx-auto flex w-full max-w-375 items-stretch justify-between gap-8 p-6'>
        <div className='flex w-130 items-start gap-4'>
          <div className='w-30 shrink-0'>
            <Skeleton className='bg-gunmetal-blue skeleton relative block h-0 w-full overflow-hidden rounded-md! pb-[150%]' />
          </div>
          <div className='flex grow flex-col gap-3'>
            <Skeleton className='bg-gunmetal-blue skeleton h-6 w-3/4 rounded' />
            <Skeleton className='bg-gunmetal-blue skeleton h-4 w-1/2 rounded' />
            <div className='flex gap-2'>
              <Skeleton className='bg-gunmetal-blue skeleton h-6 w-16 rounded-full!' />
              <Skeleton className='bg-gunmetal-blue skeleton h-6 w-16 rounded-full!' />
              <Skeleton className='bg-gunmetal-blue skeleton h-6 w-20 rounded-full!' />
            </div>
            <div className='flex gap-2'>
              <Skeleton className='bg-gunmetal-blue skeleton h-6 w-24 rounded-full!' />
              <Skeleton className='bg-gunmetal-blue skeleton h-6 w-24 rounded-full!' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
