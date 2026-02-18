import { ageRatings, MOVIE_TYPE_SERIES } from '@/constants';
import { route } from '@/routes';
import { MovieResType } from '@/types';
import { renderImageUrl } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function TopViewItem({
  movie,
  index
}: {
  movie: MovieResType;
  index: number;
}) {
  const ageRating = ageRatings.find((age) => movie?.ageRating === age.value);
  const isSeries = movie.type === MOVIE_TYPE_SERIES;

  return (
    <Link href={`${route.movie.path}/${movie.slug}.${movie.id}`}>
      <div className='flex items-center justify-between'>
        <div className='w-15 shrink-0 text-left text-[56px] font-extrabold text-[#191b24] text-shadow-[-1px_0_#fff,_0_1px_#fff,_1px_0_#fff,_0_-1px_#fff]'>
          {index}
        </div>
        <div className='flex grow items-center justify-between rounded bg-white/5 transition-colors duration-200 ease-linear hover:bg-white/4'>
          <div className='w-20 shrink-0'>
            <div className='bg-gunmetal-blue relative block h-0 w-full rounded pb-[150%]'>
              <Image
                src={renderImageUrl(movie.posterUrl)}
                width={80}
                height={0}
                alt={`${movie.title} - ${movie.originalTitle}`}
                className='absolute inset-0 h-full w-full object-cover'
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
              <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.8px] before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
                <strong>Phần {movie.latestSeason}</strong>
              </div>
              {isSeries && (
                <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.8px] before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
                  <strong>Tập {movie.latestEpisode}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
