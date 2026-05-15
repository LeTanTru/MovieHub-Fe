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
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  PERSON_KIND_ACTOR,
  PERSON_KIND_DIRECTOR
} from '@/constants';
import { route } from '@/routes';
import {
  formatDate,
  formatDuration,
  generateSlug,
  getYearFromDate,
  parseJSON,
  renderImageUrl,
  sanitizeText
} from '@/utils';
import { Activity } from '@/components/activity';
import { cn } from '@/lib';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import ActorList from './actor-list';
import Image from 'next/image';
import Link from 'next/link';
import TopViewList from './top-view-list';
import type { MetadataType, PersonResType } from '@/types';
import { MovieProgress } from '@/components/app/movie-progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function MovieSide() {
  const { movie, moviePersons, selectedSeason } = useMovieStore(
    useShallow((s) => ({
      movie: s.movie,
      moviePersons: s.moviePersons,
      selectedSeason: s.selectedSeason
    }))
  );

  const ageRating = ageRatings.find(
    (age) => movie?.ageRating === age.value
  )?.label;

  const categories = movie?.categories || [];

  const countryName =
    countries.find((country) => country.value === movie?.country)?.label ||
    'Đang cập nhật';

  const languageName =
    languages.find((language) => language.value === movie?.language)?.label ||
    'Đang cập nhật';

  const directors = moviePersons.reduce<PersonResType[]>((acc, moviePerson) => {
    if (moviePerson.kind === PERSON_KIND_DIRECTOR) {
      acc.push(moviePerson.person);
    }
    return acc;
  }, []);

  const actors = moviePersons.reduce<PersonResType[]>((acc, moviePerson) => {
    if (moviePerson.kind === PERSON_KIND_ACTOR) {
      acc.push(moviePerson.person);
    }
    return acc;
  }, []);

  const metadata = parseJSON<MetadataType>(movie?.metadata || '{}');

  // For series movie
  const latestSeason = selectedSeason || metadata?.latestSeason?.label;

  const currentSeason = movie?.seasons?.find(
    (season) => season.label === latestSeason?.toString()
  );

  const episodes = currentSeason?.episodes || [];

  const latestEpisode = episodes?.length
    ? episodes[episodes.length - 1]?.label
    : metadata?.latestEpisode?.label;

  const latestEpisodeVideo = episodes?.[episodes.length - 1]?.video;
  // For series movie

  const duration = metadata?.duration || latestEpisodeVideo?.duration;

  const sanitizedDescription = sanitizeText(
    currentSeason?.description || movie?.description || 'Đang cập nhật'
  );

  const releaseDate = currentSeason?.releaseDate || movie?.releaseDate;

  const isComplete =
    episodes.length > 0 && currentSeason?.totalEpisode === episodes.length;

  const isSingle = movie?.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie?.type === MOVIE_TYPE_SERIES;

  const releaseYear = getYearFromDate(
    currentSeason?.releaseDate ||
      metadata?.latestSeason?.releaseDate ||
      movie?.releaseDate
  );

  if (!movie)
    return (
      <div className='bg-main-background/60 flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'></div>
    );

  return (
    <div className='bg-main-background/60 max-1360:p-7.5 max-1360:w-95 max-1280:bg-transparent max-1280:backdrop-blur-none max-1280:p-0 max-1280:w-85 max-1120:w-full max-1120:mb-0 max-1120:text-center flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'>
      <div className='max-1120:mx-auto mb-4 w-30'>
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
        className={cn(
          'max-640:mb-1 mb-2 text-2xl leading-normal font-semibold text-white',
          {
            'featured-title': movie.isFeatured
          }
        )}
      >
        {movie.title}
      </h2>
      <div className='text-golden-glow max-1120:mb-4 max-1120:-mt-0.75 max-640:mb-3 mb-5 font-normal'>
        {movie.originalTitle}
      </div>
      <div className='max-1120:p-6 max-640:p-4 max-1120:rounded-md max-1120:bg-[rgba(0,0,0,.2)] max-1120:text-left'>
        <TagWrapper className='mb-3'>
          {ageRating ? <TagAgeRating value={ageRating} /> : null}
          <TagNormal value={releaseYear} />
          {/* Single movie */}
          <Activity visible={isSingle && !!duration}>
            <TagNormal value={formatDuration(duration)} />
          </Activity>
          {/* Series movie */}
          <Activity visible={isSeries}>
            <Activity visible={!!latestSeason}>
              <TagNormal value={`Phần ${latestSeason}`} />
            </Activity>
            <Activity visible={!!latestEpisode}>
              <TagNormal value={`Tập ${latestEpisode}`} />
            </Activity>
          </Activity>
          {isSeries && isComplete && (
            <TagNormal
              value={`Hoàn tất ${episodes.length} / ${currentSeason?.totalEpisode || '?'} tập`}
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
        <div className='mb-5'>
          <div className='mb-2 block font-medium text-white'>Giới thiệu:</div>
          <div
            className='text-foreground/80'
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <div className='font-medium whitespace-nowrap text-white'>
            Ngày phát hành:
          </div>
          <div className='text-foreground/80'>
            {formatDate(releaseDate, DEFAULT_DATE_FORMAT)}
          </div>
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <div className='font-medium whitespace-nowrap text-white'>
            Thời lượng:
          </div>
          <div className='text-foreground/80'>
            {duration ? formatDuration(duration) : 'Đang cập nhật'}
          </div>
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <div className='font-medium whitespace-nowrap text-white'>
            Quốc gia:
          </div>
          <Link
            href={`${route.country.path}/${generateSlug(
              countryName
            )}.${movie.country}`}
            className='text-foreground/80 hover:text-golden-glow linear transition duration-200'
          >
            {countryName}
          </Link>
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <div className='font-medium whitespace-nowrap text-white'>
            Ngôn ngữ:
          </div>
          <div className='text-foreground/80'>{languageName}</div>
        </div>
        <div className='max-1120:mb-0 mb-5 flex items-start gap-2'>
          <div className='font-medium whitespace-nowrap text-white'>
            Đạo diễn:
          </div>
          <span className='text-foreground/80'>
            {directors.length > 0
              ? directors.map((director) => director.otherName).join(', ')
              : 'Đang cập nhật'}
          </span>
        </div>
      </div>
      <ActorList actors={actors} />
      <TopViewList />
    </div>
  );
}

MovieSide.Skeleton = function () {
  return (
    <div className='bg-main-background/60 max-1360:p-7.5 max-1360:w-95 max-1280:bg-transparent max-1280:backdrop-blur-none max-1280:p-0 max-1280:w-85 max-1120:w-full max-1120:mb-0 max-1120:text-center flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'>
      <div className='max-1120:mx-auto mb-4 w-30'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[150%]'>
          <Skeleton className='skeleton absolute! top-0 left-0 size-full rounded-md!' />
        </div>
      </div>
      <Skeleton className='skeleton max-1120:mx-auto max-640:mb-1 mb-2 h-7 w-1/2' />
      <Skeleton className='skeleton max-1120:mx-auto max-1120:mb-4 max-1120:-mt-0.75 max-640:mb-3 mb-5 h-4 w-1/2' />
      <div className='max-1120:p-6 max-640:p-4 max-1120:rounded-md max-1120:bg-[rgba(0,0,0,.2)] max-1120:text-left'>
        {/* TagWrapper 1: Age rating, year, duration/episodes */}
        <div className='mb-3 flex flex-wrap items-center justify-start gap-2.5'>
          <Skeleton className='skeleton h-6.5 w-10 rounded!' />
          <Skeleton className='skeleton h-6.5 w-12 rounded border border-solid!' />
          <Skeleton className='skeleton h-6.5 w-14 rounded border border-solid!' />
          <Skeleton className='skeleton h-6.5 w-14 rounded border border-solid!' />
        </div>
        {/* TagWrapper 2: Categories */}
        <div className='mb-3 flex flex-wrap items-center justify-start gap-2.5'>
          <Skeleton className='skeleton h-6.5 w-16 rounded!' />
          <Skeleton className='skeleton h-6.5 w-14 rounded!' />
          <Skeleton className='skeleton h-6.5 w-12 rounded!' />
        </div>
        {/* MovieProgress skeleton */}
        <div className='mb-3'>
          <Skeleton className='skeleton h-8 w-36 rounded-4xl!' />
        </div>
        {/* Description */}
        <div className='mb-5'>
          <Skeleton className='skeleton mb-2 h-4 w-20' />
          <div className='flex flex-col gap-2'>
            <Skeleton className='skeleton h-4 w-full' />
            <Skeleton className='skeleton h-4 w-full' />
            <Skeleton className='skeleton h-4 w-3/4' />
          </div>
        </div>
        {/* Info rows */}
        <div className='mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-28 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-20 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-16 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-16 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
        <div className='max-1120:mb-0 mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-14 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
      </div>
      {/* ActorList skeleton - hidden on screens <= 1120px */}
      <div className='max-1120:hidden mb-5'>
        <Skeleton className='skeleton mb-8 h-8 w-32' />
        <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`actor-skeleton-${index}`}
              className='flex flex-col items-center gap-3 text-center'
            >
              <Skeleton className='skeleton size-20 rounded-full!' />
              <Skeleton className='skeleton h-4 w-16' />
            </div>
          ))}
        </div>
      </div>
      {/* TopViewList skeleton - hidden on screens <= 1120px */}
      <div className='max-1120:hidden border-t border-solid border-white/10 pt-8'>
        <div className='mb-4 flex min-h-10 items-center gap-4'>
          <Skeleton className='skeleton size-6 rounded!' />
          <Skeleton className='skeleton h-6 w-32' />
        </div>
        <div className='flex flex-col gap-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`top-view-skeleton-${index}`}
              className='flex items-center justify-between gap-2'
            >
              <Skeleton className='skeleton h-14 w-15 shrink-0' />
              <div className='flex grow items-center justify-between rounded bg-white/5 p-2.5'>
                <div className='w-20 shrink-0'>
                  <Skeleton className='skeleton h-full w-full rounded! pb-[150%]' />
                </div>
                <div className='grow px-4'>
                  <Skeleton className='skeleton mb-1.5 h-4 w-3/4' />
                  <Skeleton className='skeleton mb-2 h-3 w-1/2' />
                  <div className='flex items-center gap-4'>
                    <Skeleton className='skeleton h-3 w-6' />
                    <Skeleton className='skeleton h-3 w-8' />
                    <Skeleton className='skeleton h-3 w-10' />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
