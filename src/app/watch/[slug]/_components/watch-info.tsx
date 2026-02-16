'use client';

import { Activity } from '@/components/activity';
import {
  TagAgeRating,
  TagCategoryLink,
  TagNormal,
  TagWrapper
} from '@/components/app/tag';
import { CircleLoading } from '@/components/loading';
import {
  ageRatings,
  countries,
  DEFAULT_DATE_FORMAT,
  languages,
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  PERSON_KIND_DIRECTOR
} from '@/constants';
import { cn } from '@/lib';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import {
  formatDate,
  formatDuration,
  generateSlug,
  renderImageUrl,
  sanitizeText
} from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';

export default function WatchInfo() {
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

  // For series movie
  const latestSeason = selectedSeason || movie?.latestSeason;

  const currentSeason = movie?.seasons?.find(
    (season) => season.ordering + 1 === latestSeason
  );

  const episodes = currentSeason?.episodes || [];

  const latestEpisode = episodes ? episodes.length : movie?.latestEpisode;

  const latestEpisodeVideo = episodes?.[episodes.length - 1]?.video;
  // For series movie

  const duration = movie?.duration || latestEpisodeVideo?.duration;

  const releaseDate = currentSeason?.releaseDate || movie?.releaseDate;

  const sanitizedDescription = sanitizeText(
    currentSeason?.description || movie?.description || 'Đang cập nhật'
  );

  const isComplete =
    episodes.length > 0 && currentSeason?.totalEpisode === episodes.length;

  const isSingle = movie?.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie?.type === MOVIE_TYPE_SERIES;

  if (!movie) return null;

  return (
    <div className='flex gap-6 border-b border-solid border-white/10 pb-10'>
      <div className='w-25 shrink-0'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded pb-[150%]'>
          <Image
            alt={`${movie.title} - ${movie.originalTitle}`}
            src={renderImageUrl(movie.posterUrl)}
            height={100}
            width={100}
            className='absolute inset-0 h-full w-full object-cover'
            unoptimized
          />
        </div>
      </div>
      <div className='w-110 shrink-0'>
        <h2
          className={cn(
            'hover:text-light-golden-yellow mb-2 text-xl leading-normal font-semibold text-white transition-all duration-200 ease-linear',
            {
              'featured-title': movie.isFeatured
            }
          )}
        >
          <Link href={`${route.movie.path}/${movie.slug}.${movie.id}`}>
            {movie.title}
          </Link>
        </h2>
        <p className='text-light-golden-yellow mb-3'>
          {movie.originalTitle} {selectedSeason > 1 ? selectedSeason : ''}
        </p>
        <TagWrapper className='mb-3'>
          {ageRating ? <TagAgeRating value={ageRating} /> : null}
          <TagNormal value={movie.year} />
          {/* Single movie */}
          <Activity visible={isSingle}>
            <TagNormal value={formatDuration(movie.duration)} />
          </Activity>
          {/* Series movie */}
          <Activity visible={isSeries}>
            <TagNormal value={`Phần ${latestSeason}`} />
            <TagNormal value={`Tập ${latestEpisode}`} />
          </Activity>
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
          <div className='mb-3'>
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
        <div className='flex items-center justify-between'>
          <div className='mb-3 flex items-end gap-2'>
            <div className='font-medium whitespace-nowrap text-white'>
              Ngày phát hành:
            </div>
            <div className='text-foreground/80 font-light'>
              {formatDate(releaseDate, DEFAULT_DATE_FORMAT)}
            </div>
          </div>
          <div className='mb-3 flex items-end gap-2'>
            <div className='font-medium whitespace-nowrap text-white'>
              Thời lượng:
            </div>
            <div className='text-foreground/80 font-light'>
              {duration ? formatDuration(duration) : 'Đang cập nhật'}
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='mb-3 flex items-end gap-2'>
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
          <div className='mb-3 flex items-end gap-2'>
            <div className='font-medium whitespace-nowrap text-white'>
              Ngôn ngữ:
            </div>
            <div className='text-foreground/80 font-light'>{languageName}</div>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex flex-wrap items-end gap-2'>
            <div className='font-medium whitespace-nowrap text-white'>
              Đạo diễn:
            </div>
            <span className='text-foreground/80 font-light'>
              {directors.length > 0
                ? directors.map((director) => director.otherName).join(', ')
                : 'Đang cập nhật'}
            </span>
          </div>
        </div>
      </div>
      <div className='grow pl-10'>
        <div
          className='mb-6 line-clamp-4'
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
        <Link
          href={`${route.movie.path}/${movie.slug}.${movie.id}`}
          className='text-light-golden-yellow hover:text-light-golden-yellow/80 flex items-center gap-2 transition-all duration-200 ease-linear'
        >
          Thông tin phim
          <FaChevronRight />
        </Link>
      </div>
    </div>
  );
}
