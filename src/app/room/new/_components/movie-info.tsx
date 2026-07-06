'use client';

import { useState } from 'react';

import Image from 'next/image';
import {
  formatDuration,
  getData,
  getYearFromDate,
  parseJSON,
  renderImageUrl,
  sanitizeText
} from '@/utils';
import {
  ageRatings,
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  storageKeys
} from '@/constants';
import { useMovieItemListQuery, useMovieItemQuery } from '@/queries';
import {
  TagAgeRating,
  TagCategoryLink,
  TagImdb,
  TagNormal,
  TagWrapper
} from '@/components/app/tag';
import { route } from '@/routes';
import { useAuth } from '@/hooks';
import { PlayIcon } from 'lucide-react';
import type { MetadataType } from '@/types';

export function MovieInfo() {
  const { isAuthenticated } = useAuth();

  const [seasonId] = useState(
    () => getData(storageKeys.ROOM_CURRENT_SEASON_ID) || ''
  );
  const [movieItemId] = useState(
    () => getData(storageKeys.ROOM_MOVIE_ITEM_ID) || ''
  );

  const { data: movieItemList = [] } = useMovieItemListQuery({
    params: { parentId: seasonId },
    enabled: isAuthenticated && !!movieItemId
  });

  const { data: movieItem } = useMovieItemQuery({
    id: movieItemId,
    enabled: isAuthenticated && !!movieItemId
  });

  const totalEpisodes = movieItemList?.length || 0;

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     removeData(storageKeys.ROOM_CURRENT_SEASON_ID);
  //     removeData(storageKeys.ROOM_MOVIE_ITEM_ID);
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  if (totalEpisodes === 0 || !movieItem) return <MovieInfo.Skeleton />;

  const movie = movieItem.movie;

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
    <div className='bg-cloud-burst max-1280:flex-row max-1280:w-full max-640:p-5 max-640:rounded-md max-640:gap-4 max-520:flex-col max-520:items-center relative flex w-107.5 shrink-0 flex-col justify-end gap-5 overflow-hidden rounded-lg p-8'>
      <div className='new-room-mask max-1280:relative max-1280:top-0 max-1280:left-0 max-1280:right-0 max-1280:w-35 absolute top-0 right-0 left-0 w-full shrink-0 mask-none'>
        <div className='bg-gunmetal-blue relative block aspect-2/3 w-full overflow-hidden rounded-md'>
          <Image
            src={renderImageUrl(movieItem?.movie.posterUrl)}
            fill
            alt='Image'
            sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
            unoptimized
            className='absolute inset-0 h-full w-full object-cover'
          />
        </div>
      </div>
      <div className='relative z-3'>
        <h2 className='mb-2 text-[20px] leading-normal font-semibold text-white'>
          {movieItem?.movie?.title}
        </h2>
        <p className='text-golden-glow mb-4'>
          {movieItem?.movie?.originalTitle}
        </p>
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
              value={`Hoàn tất ${totalEpisodes} / ${totalEpisodes} tập`}
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
        <div
          className='text-dark-gray line-clamp-3 text-justify leading-[1.6]'
          dangerouslySetInnerHTML={{
            __html: sanitizeText(movieItem.movie?.description)
          }}
        />
        {isSingle && (
          <div className='max-520:w-full max-520:flex max-520:justify-center mt-4 inline-flex items-center gap-2 rounded-md border border-solid border-white p-2 font-semibold'>
            <PlayIcon className='size-4 fill-white' />
            Phần {season} - Tập full
          </div>
        )}
        {isSeries && (
          <div className='max-520:w-full max-520:flex max-520:justify-center mt-4 inline-flex items-center gap-2 rounded-md border border-solid border-white p-2 font-semibold'>
            <PlayIcon className='size-4 fill-white' />
            Phần {season} - Tập {episode}
          </div>
        )}
      </div>
    </div>
  );
}

MovieInfo.Skeleton = function MovieInfoSkeleton() {
  return (
    <div className='bg-cloud-burst max-1280:flex-row max-1280:w-full max-640:p-5 max-640:rounded-md max-640:gap-4 max-520:flex-col max-520:items-center relative flex w-107.5 shrink-0 flex-col justify-end gap-5 overflow-hidden rounded-lg p-8'>
      {/* Skeleton poster */}
      <div className='new-room-mask max-1280:relative max-1280:top-0 max-1280:left-0 max-1280:right-0 max-1280:w-35 absolute top-0 right-0 left-0 w-full shrink-0 mask-none'>
        <div className='bg-gunmetal-blue relative block aspect-2/3 w-full overflow-hidden rounded-md'>
          <div className='absolute inset-0 animate-pulse bg-white/5' />
        </div>
      </div>

      {/* Skeleton content */}
      <div className='relative z-3 space-y-3'>
        {/* Title */}
        <div className='h-5 w-3/4 animate-pulse rounded-md bg-white/10' />
        {/* Subtitle */}
        <div className='h-4 w-1/2 animate-pulse rounded-md bg-white/8' />

        {/* Tags row */}
        <div className='flex gap-2 pt-1'>
          <div className='h-5 w-12 animate-pulse rounded bg-white/10' />
          <div className='h-5 w-10 animate-pulse rounded bg-white/10' />
          <div className='h-5 w-14 animate-pulse rounded bg-white/10' />
        </div>

        {/* Category tags row */}
        <div className='flex gap-2'>
          <div className='h-5 w-16 animate-pulse rounded bg-white/8' />
          <div className='h-5 w-20 animate-pulse rounded bg-white/8' />
        </div>

        {/* Description lines */}
        <div className='space-y-2 pt-1'>
          <div className='h-3.5 w-full animate-pulse rounded bg-white/8' />
          <div className='h-3.5 w-5/6 animate-pulse rounded bg-white/8' />
          <div className='h-3.5 w-2/3 animate-pulse rounded bg-white/8' />
        </div>
      </div>
    </div>
  );
};
