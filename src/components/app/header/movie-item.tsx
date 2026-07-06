import { ageRatings, MOVIE_TYPE_SERIES } from '@/constants';
import { route } from '@/routes';
import type { MetadataType, MovieResType } from '@/types';
import { getYearFromDate, parseJSON, renderImageUrl } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';

type MovieItemProps = {
  movie: MovieResType;
  onClick?: () => void;
};

export function MovieItem({ movie, onClick }: MovieItemProps) {
  const ageRating = ageRatings.find((age) => movie.ageRating === age.value);

  const isSeries = movie.type === MOVIE_TYPE_SERIES;

  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

  const latestSeason = metadata?.latestSeason;

  const latestEpisode = metadata?.latestEpisode;

  const releaseYear = getYearFromDate(
    latestSeason?.releaseDate || movie.releaseDate
  );

  return (
    <Link
      key={movie.id}
      href={`${route.movie.path}/${movie.slug}.${movie.id}`}
      onClick={onClick}
      className='flex items-center justify-between gap-4 rounded p-2.5 transition-colors duration-200 ease-linear hover:bg-white/5'
    >
      <div className='w-12.5 shrink-0'>
        <div className='bg-gunmetal-blue relative block h-0 w-full rounded pb-[135%]'>
          <Image
            src={renderImageUrl(movie.posterUrl)}
            alt={`${movie.title} - ${movie.originalTitle}`}
            width={50}
            height={70}
            className='absolute inset-0 size-full object-cover'
          />
        </div>
      </div>
      <div className='grow'>
        <h3 className='mb-1 line-clamp-2 leading-normal text-white'>
          {movie.title}
        </h3>
        <div className='mb-1 line-clamp-1 text-xs leading-normal text-neutral-400'>
          {movie.originalTitle}
        </div>
        <div className='flex items-center gap-4'>
          <div
            className='inline text-xs whitespace-nowrap text-neutral-400'
            title={ageRating?.mean}
          >
            <strong>{ageRating?.label}</strong>
          </div>
          <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
            <strong>{releaseYear}</strong>
          </div>
          {!!latestSeason && (
            <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
              <strong>Phần {latestSeason?.label}</strong>
            </div>
          )}
          {isSeries && !!latestEpisode && (
            <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
              <strong>Tập {latestEpisode?.label}</strong>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
