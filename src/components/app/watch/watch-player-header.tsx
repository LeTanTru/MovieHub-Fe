'use client';

import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa6';
import { route } from '@/routes';
import { useWatchPlayer } from '@/app/watch/[slug]/_context';

export function WatchPlayerHeader() {
  const { movie, videoTitle } = useWatchPlayer();

  if (!movie) return null;

  return (
    <div className='max-640:mt-4 max-640:mb-2 max-640:gap-2 max-640:gap-2 max-640:px-2 mb-4 inline-flex w-full items-center gap-4 px-4 text-justify'>
      <Link
        href={`${route.movie.path}/${movie.slug}.${movie.id}`}
        className='max-1120:p-1.5 max-640:p-1 rounded-full border border-solid border-gray-200 p-2 opacity-50 transition-all duration-200 ease-linear hover:opacity-100'
      >
        <FaChevronLeft />
      </Link>
      <h3 className='max-1120:font-semibold max-1120:text-lg max-640:text-sm text-xl font-semibold'>
        Xem phim {videoTitle}
      </h3>
    </div>
  );
}
