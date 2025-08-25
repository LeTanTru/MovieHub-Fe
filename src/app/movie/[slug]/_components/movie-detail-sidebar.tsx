'use client';

import {
  TagAgeRating,
  TagCategoryLink,
  TagIMDb,
  TagNormal,
  TagWrapper
} from '@/components/tag';
import {
  ageRatings,
  AppConstants,
  movieItemKinds,
  PERSON_DIRECTOR
} from '@/constants';
import { useMovieItemListQuery, useMoviePersonListQuery } from '@/queries';
import route from '@/routes';
import { MovieResType } from '@/types';
import { formatDate, formatDuration } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function MovieDetailSidebar({ movie }: { movie: MovieResType }) {
  const movieItemRes = useMovieItemListQuery({
    movieId: movie.id,
    kind: movieItemKinds.MOVIE_ITEM_KIND_SEASON
  });
  const personRes = useMoviePersonListQuery({
    movieId: movie.id,
    kind: PERSON_DIRECTOR
  });
  const movieItems = movieItemRes.data?.data.content;
  const persons = personRes.data?.data.content;
  if (!movieItems || !persons) return null;
  const movieItem = movieItems[0];
  const video = movieItem.video;
  return (
    <div className='bg-background/30 flex w-110 flex-shrink-0 flex-col p-10'>
      <div className='mb-4 font-light min-[1280px]:w-40'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[150%]'>
          {movie && (
            <Image
              fill
              sizes='(max-width: 480px) 100vw,
                    (max-width: 640px) 50vw,
                    (max-width: 1280px) 33vw,
                    25vw'
              src={`${AppConstants.contentRootUrl}${movie.thumbnailUrl}`}
              alt={`${movie?.title} - ${movie?.originalTitle}`}
              className='object-cover'
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
        <div className='mb-5 flex items-end gap-2 text-sm'>
          <div className='font-medium whitespace-nowrap text-white'>
            Quốc gia:
          </div>
          <Link
            href={`${route.country}/${movie.country}`}
            className='text-statuary hover:text-light-golden-yellow linear font-light transition duration-200'
          >
            {movie.country}
          </Link>
        </div>
        <div className='mb-5 flex items-end gap-2 text-sm'>
          <div className='font-medium whitespace-nowrap text-white'>
            Đạo diễn:
          </div>
          {persons.map((person, index) => (
            <Link
              key={person.id}
              href={`${route.person}/${person.person.id}`}
              className='text-statuary hover:text-light-golden-yellow linear font-light transition duration-200'
            >
              {person.person.otherName}
              {index < persons.length - 1 && ','}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
