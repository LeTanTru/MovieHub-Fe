'use client';

import {
  TagAgeRating,
  TagCategoryLink,
  TagNormal,
  TagWrapper
} from '@/components/app/tag';
import {
  ageRatings,
  countries,
  DEFAULT_DATE_FORMAT,
  languages,
  PERSON_ACTOR,
  PERSON_DIRECTOR
} from '@/constants';
import { route } from '@/routes';
import { PersonResType } from '@/types';
import {
  formatDate,
  formatDuration,
  generateSlug,
  getYearFromDate,
  renderImageUrl,
  sanitizeText
} from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib';
import { useMovieStore } from '@/store';

const ActoCell = ({ actor }: { actor: PersonResType }) => {
  return (
    <div className='flex flex-col items-center gap-3 text-center'>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='bg-main-background relative h-20 w-20 shrink-0 overflow-hidden rounded-full'
      >
        <Image
          alt={actor.otherName}
          className='absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
          fill
          sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
          src={renderImageUrl(actor.avatarPath)}
        />
      </Link>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='hover:text-light-golden-yellow mb-1.5 text-sm leading-normal font-normal whitespace-normal text-white transition-all duration-200 ease-linear'
        title={actor.otherName}
      >
        {actor.otherName}
      </Link>
    </div>
  );
};

export default function MovieInfo() {
  const { movie, movieItems, moviePersons } = useMovieStore();

  const movieItem = movieItems[0];
  const actors = useMemo(
    () =>
      moviePersons
        .filter((moviePerson) => moviePerson.kind === PERSON_ACTOR)
        .map((moviePerson) => moviePerson.person),
    [moviePersons]
  );

  const directors = useMemo(
    () =>
      moviePersons
        .filter((moviePerson) => moviePerson.kind === PERSON_DIRECTOR)
        .map((moviePerson) => moviePerson.person),
    [moviePersons]
  );

  const video = movieItem?.video;

  const ageRating = ageRatings.find(
    (age) => movie?.ageRating === age.value
  )?.label;

  const countryName =
    countries.find((country) => country.value === movie?.country)?.label ||
    'Đang cập nhật';

  const languageName =
    languages.find((language) => language.value === movie?.language)?.label ||
    'Đang cập nhật';

  const sanitizedDescription = useMemo(
    () => sanitizeText(movie?.description || 'Đang cập nhật'),
    [movie?.description]
  );

  if (!movie || !movieItems || !moviePersons) return null;

  return (
    <div className='bg-main-background/60 flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'>
      <div className='mb-4 font-light xl:w-40'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[150%]'>
          <Image
            alt={`${movie.title} - ${movie.originalTitle}`}
            className='h-full w-full object-cover'
            fill
            priority
            sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
            src={renderImageUrl(movie.posterUrl)}
          />
        </div>
      </div>
      <h2
        className={cn('mb-2 text-2xl leading-normal font-semibold text-white', {
          'featured-title': movie.isFeatured
        })}
      >
        {movie.title}
      </h2>
      <div className='text-light-golden-yellow mb-6 text-sm font-normal'>
        {movie.originalTitle}
      </div>
      <TagWrapper className='mb-4'>
        {ageRating ? <TagAgeRating value={ageRating} /> : null}
        <TagNormal value={getYearFromDate(movie.releaseDate)} />
        {video && <TagNormal value={formatDuration(video.duration)} />}
      </TagWrapper>
      <TagWrapper>
        {movie.categories.map((category) => (
          <TagCategoryLink
            key={category.id}
            href={`${route.category.path}/${category.slug}.${category.id}`}
            text={category.name}
          />
        ))}
      </TagWrapper>
      <div className='mt-5 mb-5 text-sm'>
        <div className='mb-2 block font-medium text-white'>Giới thiệu:</div>
        <div
          className='text-foreground/80! text-sm font-light'
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </div>
      <div className='mb-5 flex items-end gap-2 text-sm'>
        <div className='font-medium whitespace-nowrap text-white'>
          Ngày phát hành:
        </div>
        <div className='text-foreground/80 font-light'>
          {formatDate(movie.releaseDate, DEFAULT_DATE_FORMAT)}
        </div>
      </div>
      <div className='mb-5 flex items-end gap-2 text-sm'>
        <div className='font-medium whitespace-nowrap text-white'>
          Thời lượng:
        </div>
        <div className='text-foreground/80 font-light'>
          {video && formatDuration(video.duration)}
        </div>
      </div>
      <div className='mb-5 flex items-end gap-2 text-sm'>
        <div className='font-medium whitespace-nowrap text-white'>
          Quốc gia:
        </div>
        <Link
          href={`${route.country.path}/${generateSlug(
            countryName
          )}.${movie.country}`}
          className='text-foreground/80 hover:text-light-golden-yellow linear font-light transition duration-200'
        >
          {countryName}
        </Link>
      </div>
      <div className='mb-5 flex items-end gap-2 text-sm'>
        <div className='font-medium whitespace-nowrap text-white'>
          Ngôn ngữ:
        </div>
        <div className='text-foreground/80 font-light'>{languageName}</div>
      </div>
      <div className='mb-5 flex flex-wrap items-end gap-2 text-sm'>
        <div className='font-medium whitespace-nowrap text-white'>
          Đạo diễn:
        </div>
        {directors.map((director, index) => (
          <span
            key={`info-director-${director.id}`}
            className='text-foreground/80 font-light'
          >
            {director.otherName}
            {index < directors.length - 1 && ','}
          </span>
        ))}
      </div>
      <div className='relative mb-8 block border-none p-0'>
        <div className='mb-4 min-h-10 text-xl leading-normal font-semibold text-white'>
          Diễn viên:
        </div>
        <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
          {actors.map((actor) => (
            <ActoCell key={`info-actor-${actor.id}`} actor={actor} />
          ))}
        </div>
      </div>
    </div>
  );
}
