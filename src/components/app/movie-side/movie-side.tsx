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
import { CircleLoading } from '@/components/loading';
import { cn } from '@/lib';
import { FaCheckCircle } from 'react-icons/fa';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import ActorList from './actor-list';
import Image from 'next/image';
import Link from 'next/link';
import MovieSideSkeleton from './movie-side-skeleton';
import TopViewList from './top-view-list';
import { MetadataType } from '@/types';

export default function MovieSide({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
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

  const directors = moviePersons
    .filter((moviePerson) => moviePerson.kind === PERSON_KIND_DIRECTOR)
    .map((moviePerson) => moviePerson.person);

  const actors = moviePersons
    .filter((moviePerson) => moviePerson.kind === PERSON_KIND_ACTOR)
    .map((moviePerson) => moviePerson.person);

  const metadata = parseJSON<MetadataType>(movie?.metadata || '{}');

  // For series movie
  const latestSeason = selectedSeason || metadata?.latestSeason?.label;

  const currentSeason = movie?.seasons?.find(
    (season) => season.label === latestSeason.toString()
  );

  const episodes = currentSeason?.episodes || [];

  const latestEpisode = episodes
    ? episodes.length
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

  if (isLoading) {
    return <MovieSideSkeleton />;
  }

  if (!movie)
    return (
      <div className='bg-main-background/60 flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'></div>
    );

  return (
    <div className='bg-main-background/60 flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'>
      <div className='mb-4 w-40 font-light'>
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
          'featured-title font-bold': movie.isFeatured
        })}
      >
        {movie.title} {+latestSeason > 1 ? selectedSeason : ''}
      </h2>
      <div className='text-light-golden-yellow mb-5 font-normal'>
        {movie.originalTitle} {+latestSeason > 1 ? selectedSeason : ''}
      </div>
      <TagWrapper className='mb-3'>
        {ageRating ? <TagAgeRating value={ageRating} /> : null}
        <TagNormal value={releaseYear} />
        {/* Single movie */}
        <Activity visible={isSingle}>
          <TagNormal value={formatDuration(duration)} />
        </Activity>
        {/* Series movie */}
        <Activity visible={isSeries}>
          <TagNormal value={`Phần ${latestSeason}`} />
          <TagNormal value={`Tập ${latestEpisode}`} />
        </Activity>
        {isSeries && isComplete && (
          <TagNormal
            value={`Hoàn tất ${episodes.length} / ${currentSeason?.totalEpisode ?? '?'} tập`}
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
        <div className='mb-5'>
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-4xl px-3.5 py-2 text-xs',
              {
                'bg-complete-episode/30 text-complete-episode': isComplete,
                'bg-on-going-episode/30 text-on-going-episode': !isComplete
              }
            )}
          >
            {isComplete ? (
              <FaCheckCircle className='fill-complete-episode stroke-complete-episode/30 size-4' />
            ) : (
              <CircleLoading className='stroke-on-going-episode size-4 animate-spin stroke-3' />
            )}
            <span>
              {isComplete ? 'Đã hoàn thành' : 'Đã chiếu'}: {episodes.length}
              &nbsp;/&nbsp;
              {currentSeason?.totalEpisode ?? '?'} Tập
            </span>
          </div>
        </div>
      )}
      <div className='mb-5'>
        <div className='mb-2 block font-medium text-white'>Giới thiệu:</div>
        <div
          className='text-foreground/80! font-light'
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </div>
      <div className='mb-5 flex items-end gap-2'>
        <div className='font-medium whitespace-nowrap text-white'>
          Ngày phát hành:
        </div>
        <div className='text-foreground/80 font-light'>
          {formatDate(releaseDate, DEFAULT_DATE_FORMAT)}
        </div>
      </div>
      <div className='mb-5 flex items-end gap-2'>
        <div className='font-medium whitespace-nowrap text-white'>
          Thời lượng:
        </div>
        <div className='text-foreground/80 font-light'>
          {duration ? formatDuration(duration) : 'Đang cập nhật'}
        </div>
      </div>
      <div className='mb-5 flex items-end gap-2'>
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
      <div className='mb-5 flex items-end gap-2'>
        <div className='font-medium whitespace-nowrap text-white'>
          Ngôn ngữ:
        </div>
        <div className='text-foreground/80 font-light'>{languageName}</div>
      </div>
      <div className='mb-5 flex flex-wrap items-end gap-2'>
        <div className='font-medium whitespace-nowrap text-white'>
          Đạo diễn:
        </div>
        <span className='text-foreground/80 font-light'>
          {directors.length > 0
            ? directors.map((director) => director.otherName).join(', ')
            : 'Đang cập nhật'}
        </span>
      </div>
      <ActorList actors={actors} />
      <TopViewList />
    </div>
  );
}
