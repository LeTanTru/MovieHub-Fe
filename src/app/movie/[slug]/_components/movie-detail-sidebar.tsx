'use client';

import {
  TagAgeRating,
  TagCategoryLink,
  TagNormal,
  TagWrapper
} from '@/components/tag';
import {
  ageRatings,
  countries,
  DEFAULT_DATE_FORMAT,
  languages,
  PERSON_ACTOR,
  PERSON_DIRECTOR
} from '@/constants';
import { cn } from '@/lib';
import { route } from '@/routes';
import { MovieItemResType, MoviePersonResType, MovieResType } from '@/types';
import {
  formatDate,
  formatDuration,
  generateSlug,
  getYearFromDate,
  renderImageUrl
} from '@/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function MovieDetailSidebar({
  movieItems,
  persons,
  movie
}: {
  movieItems: MovieItemResType[];
  persons: MoviePersonResType[];
  movie: MovieResType;
}) {
  const movieItem = movieItems[0];
  const actors = persons.filter((person) => person.kind === PERSON_ACTOR);
  const directors = persons.filter((person) => person.kind === PERSON_DIRECTOR);
  const video = movieItem?.video;
  const countryName =
    countries.find((country) => country.value === movie.country)?.label || '';

  const languageName =
    languages.find((language) => language.value === movie.language)?.label ||
    '';

  return (
    <div className='bg-main-background/60 flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'>
      <div className='mb-4 font-light xl:w-40'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[150%]'>
          <Image
            alt={`${movie.title} - ${movie.originalTitle}`}
            className='h-full w-full object-cover'
            fill
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
        <TagAgeRating
          value={
            ageRatings.find((age) => movie.ageRating === age.value)?.label!
          }
        />
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
          className='text-foreground/80 text-sm font-light'
          dangerouslySetInnerHTML={{ __html: movie.description || '' }}
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
      {video && (
        <div className='mb-5 flex items-end gap-2 text-sm'>
          <div className='font-medium whitespace-nowrap text-white'>
            Thời lượng:
          </div>
          <div className='text-foreground/80 font-light'>
            {formatDuration(video.duration)}
          </div>
        </div>
      )}
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
        {directors?.map((director, index) => (
          <span key={director.id} className='text-foreground/80 font-light'>
            {director.person.otherName}
            {index < directors.length - 1 && ','}
          </span>
        ))}
      </div>
      <div className='relative mb-8 block border-none p-0'>
        <div className='mb-4 min-h-10 text-xl leading-normal font-semibold text-white'>
          Diễn viên:
        </div>
        <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
          {actors?.map((actor) => (
            <div
              key={actor.id}
              className='flex flex-col items-center gap-3 text-center'
            >
              <Link
                href={`${route.person.path}/${actor.person.id}`}
                className='bg-background relative h-20 w-20 shrink-0 overflow-hidden rounded-full'
              >
                <Image
                  alt={actor.person.otherName}
                  className='absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-101'
                  fill
                  sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                  src={renderImageUrl(actor.person.avatarPath)}
                />
              </Link>
              <div>
                <h4 className='hover:text-light-golden-yellow mb-1.5 line-clamp-2 text-sm leading-normal font-normal whitespace-nowrap text-white transition-all duration-200 ease-linear'>
                  <Link href={`${route.person.path}/${actor.person.id}`}>
                    {actor.person.otherName}
                  </Link>
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
