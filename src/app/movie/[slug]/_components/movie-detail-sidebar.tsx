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
  apiConfig,
  AppConstants,
  movieItemKinds,
  PERSON_ACTOR,
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
    movieId: movie.id
  });
  const movieItems = movieItemRes.data?.data.content;
  const persons = personRes.data?.data.content;
  if (!movieItems || !persons) return null;
  const movieItem = movieItems[0];
  const actors = persons.filter((person) => person.kind === PERSON_ACTOR);
  const directors = persons.filter((person) => person.kind === PERSON_DIRECTOR);
  const video = movieItem.video;

  return (
    <div className='bg-background/30 flex w-110 flex-shrink-0 flex-col p-10'>
      <div className='mb-4 font-light min-xl:w-40'>
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
        <div className='mb-5 flex flex-wrap items-end gap-2 text-sm'>
          <div className='font-medium whitespace-nowrap text-white'>
            Đạo diễn:
          </div>
          {directors.map((director, index) => (
            <Link
              key={director.id}
              href={`${route.person}/${director.person.id}`}
              className='text-statuary hover:text-light-golden-yellow linear font-light transition duration-200'
            >
              {director.person.otherName}
              {index < directors.length - 1 && ','}
            </Link>
          ))}
        </div>
        <div className='relative mb-8 block border-none p-0'>
          <div className='mb-4 min-h-10 text-xl leading-[1.5] font-semibold text-white'>
            Diễn viên:
          </div>
          <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
            {actors.map((actor) => (
              <div
                key={actor.id}
                className='flex flex-col items-center gap-3 text-center'
              >
                <Link
                  href={`${route.person}/${actor.person.id}`}
                  className='bg-background relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full'
                >
                  <Image
                    className='absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
                    src={`${apiConfig.imageProxy.baseUrl}${actor.person.avatarPath}`}
                    alt={actor.person.otherName}
                    fill
                  />
                </Link>
                <div>
                  <h4 className='hover:text-light-golden-yellow mb-1.5 line-clamp-2 text-sm leading-[1.5] font-normal whitespace-nowrap text-white transition-all duration-200 ease-linear'>
                    <Link href={`${route.person}/${actor.person.id}`}>
                      {actor.person.otherName}
                    </Link>
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
