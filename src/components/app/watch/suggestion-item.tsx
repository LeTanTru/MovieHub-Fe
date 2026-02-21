import { ageRatings, MOVIE_TYPE_SERIES } from '@/constants';
import { route } from '@/routes';
import { MetadataType, MovieResType } from '@/types';
import { getYearFromDate, parseJSON, renderImageUrl } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function SuggestionItem({ movie }: { movie: MovieResType }) {
  const ageRating = ageRatings.find((age) => movie?.ageRating === age.value);
  const isSeries = movie.type === MOVIE_TYPE_SERIES;

  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

  const latestSeason = metadata?.latestSeason;
  const latestEpisode = metadata?.latestEpisode;
  const releaseYear = getYearFromDate(
    latestSeason?.releaseDate || movie.releaseDate
  );

  return (
    <Link
      href={`${route.movie.path}/${movie.slug}.${movie.id}`}
      className='flex grow flex-row items-center justify-between overflow-hidden rounded bg-white/5 transition-all duration-200 ease-linear hover:bg-white/4'
    >
      <div className='w-20 shrink-0'>
        <div className='bg-gunmetal-blue relative block h-0 overflow-hidden rounded pb-[150%]'>
          <Image
            alt={`${movie.title} - ${movie.originalTitle}`}
            src={renderImageUrl(movie.posterUrl)}
            height={100}
            width={80}
            className='absolute inset-0 h-full w-full object-cover'
            unoptimized
          />
        </div>
      </div>
      <div className='grow px-4 py-2.5'>
        <h3 className='hover:text-light-golden-yellow mb-1.5 line-clamp-2 leading-normal font-medium text-white transition-all duration-200 ease-linear'>
          {movie.title}
        </h3>
        <p className='mb-1.5 line-clamp-1 text-xs leading-normal font-normal text-neutral-400'>
          {movie.originalTitle}
        </p>
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
          <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
            <strong>Phần {latestSeason?.label}</strong>
          </div>
          {isSeries && (
            <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
              <strong>Tập {latestEpisode?.label}</strong>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
