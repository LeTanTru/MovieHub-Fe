'use client';

import { MovieProgress } from '@/components/app/movie-progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TagAgeRating,
  TagCategoryLink,
  TagImdb,
  TagNormal,
  TagWrapper
} from '@/components/app/tag';
import { DATE_FORMAT } from '@/constants';
import { cn } from '@/lib';
import { route } from '@/routes';
import { useMovieInfo } from '@/hooks';
import {
  formatDate,
  formatDuration,
  generateSlug,
  renderImageUrl
} from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';

export function WatchInfo() {
  const {
    ageRating,
    categories,
    countryName,
    currentSeason,
    directors,
    duration,
    episodes,
    isComplete,
    isSeries,
    isSingle,
    languageName,
    latestEpisode,
    latestSeason,
    movie,
    releaseDate,
    releaseYear,
    sanitizedDescription
  } = useMovieInfo();

  if (!movie) return <WatchInfo.Skeleton />;

  return (
    <div className='max-1280:hidden flex gap-6 border-b border-solid border-white/10 pb-4'>
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
        <h2 className='mb-2 text-xl leading-normal text-white'>
          <Link
            href={`${route.movie.path}/${movie.slug}.${movie.id}`}
            className={cn(
              'hover:text-golden-glow font-normal transition-colors duration-200 ease-linear',
              {
                'featured-title': movie.isFeatured
              }
            )}
          >
            {movie.title}
          </Link>
        </h2>
        <p className='text-golden-glow mb-3'>{movie.originalTitle}</p>
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
              <TagNormal value={`Phần ${latestSeason}`} />
              {!!latestEpisode && <TagNormal value={`Tập ${latestEpisode}`} />}
            </>
          )}
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
        <div className='flex items-center justify-between'>
          <div className='mb-3 flex items-end gap-2'>
            <div className='font-medium whitespace-nowrap text-white'>
              Ngày phát hành:
            </div>
            <div className='text-foreground/80'>
              {formatDate(releaseDate, DATE_FORMAT)}
            </div>
          </div>
          <div className='mb-3 flex items-end gap-2'>
            <div className='font-medium whitespace-nowrap text-white'>
              Thời lượng:
            </div>
            <div className='text-foreground/80'>
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
              className='text-foreground/80 hover:text-golden-glow linear transition duration-200'
            >
              {countryName}
            </Link>
          </div>
          <div className='mb-3 flex items-end gap-2'>
            <div className='font-medium whitespace-nowrap text-white'>
              Ngôn ngữ:
            </div>
            <div className='text-foreground/80'>{languageName}</div>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex flex-wrap items-end gap-2'>
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
      </div>
      <div className='grow pl-10'>
        <div
          className='max-640:mb-2 mb-4 line-clamp-4 text-justify leading-normal'
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
        <Link
          href={`${route.movie.path}/${movie.slug}.${movie.id}`}
          className='text-golden-glow hover:text-golden-glow/80 flex items-center gap-2 transition-colors duration-200 ease-linear'
        >
          Thông tin phim
          <FaChevronRight />
        </Link>
      </div>
    </div>
  );
}

WatchInfo.Skeleton = function WatchInfoSkeleton() {
  return (
    <div className='max-1280:hidden flex gap-6 border-b border-solid border-white/10 pb-4'>
      <div className='w-25 shrink-0'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded pb-[150%]'>
          <Skeleton className='skeleton absolute! top-0 left-0 size-full rounded!' />
        </div>
      </div>
      <div className='w-110 shrink-0'>
        <Skeleton className='skeleton mb-2 h-6 w-3/4' />
        <Skeleton className='skeleton mb-3 h-5 w-1/2' />
        <div className='mb-3 flex gap-2'>
          <Skeleton className='skeleton h-6 w-12' />
          <Skeleton className='skeleton h-6 w-16' />
          <Skeleton className='skeleton h-6 w-20' />
        </div>
        <div className='mb-3 flex gap-2'>
          <Skeleton className='skeleton h-6 w-20' />
          <Skeleton className='skeleton h-6 w-24' />
        </div>
        <div className='mb-3 flex items-center justify-between'>
          <Skeleton className='skeleton h-5 w-32' />
          <Skeleton className='skeleton h-5 w-24' />
        </div>
        <div className='mb-3 flex items-center justify-between'>
          <Skeleton className='skeleton h-5 w-24' />
          <Skeleton className='skeleton h-5 w-24' />
        </div>
        <Skeleton className='skeleton h-5 w-40' />
      </div>
      <div className='grow pl-10'>
        <Skeleton className='skeleton max-640:mb-2 mb-4 h-20 w-full' />
        <Skeleton className='skeleton h-5 w-28' />
      </div>
    </div>
  );
};
