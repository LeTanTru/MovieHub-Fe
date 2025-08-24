'use client';

import {
  TagAgeRating,
  TagCategoryLink,
  TagIMDb,
  TagNormal,
  TagWrapper
} from '@/components/tag';
import { ageRatings, AppConstants, movieItemKinds } from '@/constants';
import { useMovieItemListQuery } from '@/queries';
import route from '@/routes';
import { MovieResType } from '@/types';
import { formatDate, formatDuration } from '@/utils';
import Image from 'next/image';

export default function MovieDetailSidebar({ movie }: { movie: MovieResType }) {
  const res = useMovieItemListQuery({
    movieId: movie.id,
    kind: movieItemKinds.MOVIE_ITEM_KIND_SEASON
  });
  const movieItems = res.data?.data.content;
  if (!movieItems) return null;
  const video = movieItems[0].video;
  return (
    <div className='bg-background/30 flex w-110 flex-shrink-0 flex-col p-10'>
      <div className='mb-4 font-light min-[1280px]:w-40'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[150%]'>
          {movie && (
            <Image
              fill
              src={`${AppConstants.contentRootUrl}${movie.thumbnailUrl}`}
              alt={`${movie?.title} - ${movie?.originalTitle}`}
            />
          )}
        </div>
      </div>
      <h2 className='mb-2 text-2xl leading-[1.5] font-semibold text-white'>
        {movie?.title}
      </h2>
      <div className='text-light-golden-yellow mb-6 text-sm font-normal'>
        {movie?.originalTitle}
      </div>
      <div>
        <TagWrapper>
          <TagIMDb value='7.7' />
          <TagAgeRating
            value={
              ageRatings.find((age) => movie?.ageRating === age.value)?.label!
            }
          />
          <TagNormal
            value={formatDate(movie?.releaseDate as string).split('/')[2]}
          />
          {video && <TagNormal value={formatDuration(video.duration)} />}
        </TagWrapper>
        <TagWrapper>
          {movie?.categories.map((category) => (
            <TagCategoryLink
              key={category.id}
              href={`${route.category}/${category.slug}`}
              text={category.name}
            />
          ))}
        </TagWrapper>
        <div className='mt-5 mb-5 text-sm'>
          <div className='mb-2 block font-medium text-white'>Giới thiệu:</div>
          <div
            className='text-statuary text-sm font-light'
            dangerouslySetInnerHTML={{ __html: movie?.description || '' }}
          />
        </div>
        {video && (
          <div className='mb-5 flex items-end gap-2 text-sm'>
            <div className='font-medium whitespace-nowrap text-white'>
              Thời lượng:
            </div>
            <div className='text-statuary font-light'>
              {formatDuration(video.duration)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
