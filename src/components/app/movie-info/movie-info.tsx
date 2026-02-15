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
import { PersonResType } from '@/types';
import {
  formatDate,
  formatDuration,
  generateSlug,
  renderImageUrl,
  sanitizeText
} from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib';
import { useMovieStore } from '@/store';
import { Activity } from '@/components/activity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { defaultAvatar } from '@/assets';
import { useShallow } from 'zustand/shallow';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleLoading } from '@/components/loading';
import { FaCheckCircle } from 'react-icons/fa';

const ActorCell = ({ actor }: { actor: PersonResType }) => {
  return (
    <div className='flex flex-col items-center gap-3 text-center'>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='bg-main-background relative h-20 w-20 shrink-0 overflow-hidden rounded-full'
      >
        <Avatar className='h-full w-full transition-all duration-200 ease-linear hover:scale-105'>
          <AvatarImage
            src={renderImageUrl(actor.avatarPath)}
            alt={actor.otherName}
          />
          <AvatarFallback>
            <AvatarImage src={defaultAvatar.src} alt={actor.otherName} />
          </AvatarFallback>
        </Avatar>
      </Link>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='hover:text-light-golden-yellow mb-1.5 leading-normal font-normal whitespace-normal text-white transition-all duration-200 ease-linear'
        title={actor.otherName}
      >
        {actor.otherName}
      </Link>
    </div>
  );
};

const MovieInfoSkeleton = () => {
  return (
    <div className='bg-main-background/60 flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'>
      <Skeleton className='skeleton mb-4 h-52 w-40 rounded-md' />
      <Skeleton className='skeleton mb-2 h-6 w-1/2 rounded' />
      <Skeleton className='skeleton mb-5 h-4 w-1/2 rounded' />
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-6 w-16 rounded' />
        <Skeleton className='skeleton h-6 w-16 rounded' />
        <Skeleton className='skeleton h-6 w-16 rounded' />
        <Skeleton className='skeleton h-6 w-16 rounded' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-6 w-16 rounded' />
        <Skeleton className='skeleton h-6 w-16 rounded' />
        <Skeleton className='skeleton h-6 w-16 rounded' />
        <Skeleton className='skeleton h-6 w-16 rounded' />
      </div>
      <div className='mb-5'>
        <Skeleton className='skeleton h-8 w-3/4 rounded-full!' />
      </div>
      <div className='mb-5 flex flex-col gap-2'>
        <Skeleton className='skeleton h-4 w-full rounded' />
        <Skeleton className='skeleton h-4 w-full rounded' />
        <Skeleton className='skeleton h-4 w-full rounded' />
        <Skeleton className='skeleton h-4 w-full rounded' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4 rounded' />
        <Skeleton className='skeleton h-4 w-1/2 rounded' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4 rounded' />
        <Skeleton className='skeleton h-4 w-1/2 rounded' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4 rounded' />
        <Skeleton className='skeleton h-4 w-1/2 rounded' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4 rounded' />
        <Skeleton className='skeleton h-4 w-1/2 rounded' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4 rounded' />
        <Skeleton className='skeleton h-4 w-1/2 rounded' />
      </div>
      <div className='mb-5 grid grid-cols-3 gap-x-2.5 gap-y-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`actor-skeleton-${index}`}
            className='flex flex-col items-center gap-3'
          >
            <Skeleton className='skeleton h-20 w-20 rounded-full!' />
            <Skeleton className='skeleton h-4 w-16' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MovieInfo({
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

  const sanitizedDescription = sanitizeText(
    currentSeason?.description || movie?.description || 'Đang cập nhật'
  );

  const releaseDate = currentSeason?.releaseDate || movie?.releaseDate;

  const isComplete =
    episodes.length > 0 && currentSeason?.totalEpisode === episodes.length;

  const isSingle = movie?.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie?.type === MOVIE_TYPE_SERIES;

  if (isLoading) {
    return <MovieInfoSkeleton />;
  }

  if (!movie)
    return (
      <div className='bg-main-background/60 flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'></div>
    );

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
        {movie.title} {selectedSeason > 1 ? selectedSeason : ''}
      </h2>
      <div className='text-light-golden-yellow mb-5 font-normal'>
        {movie.originalTitle} {selectedSeason > 1 ? selectedSeason : ''}
      </div>
      <TagWrapper className='mb-5'>
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
      <TagWrapper className='mb-5'>
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
              'inline-flex items-center gap-2 rounded-4xl px-3.5 py-2',
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
              {isComplete ? 'Đã hoàn thành' : 'Đã chiếu'}: {episodes?.length}
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
      <div
        className={cn('mb-5 flex-wrap items-end gap-2', {
          flex: actors.length === 0
        })}
      >
        <h3
          className={cn('font-medium whitespace-nowrap text-white', {
            'mb-8 text-2xl': actors.length > 0
          })}
        >
          Diễn viên:
        </h3>
        {actors.length > 0 ? (
          <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
            {actors.map((actor) => (
              <ActorCell key={`info-actor-${actor.id}`} actor={actor} />
            ))}
          </div>
        ) : (
          <span className='text-foreground/80 font-light'>Đang cập nhật</span>
        )}
      </div>
    </div>
  );
}
