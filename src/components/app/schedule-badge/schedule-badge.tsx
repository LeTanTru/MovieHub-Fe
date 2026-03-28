'use client';

import { bell } from '@/assets';
import { DEFAULT_DATE_FORMAT } from '@/constants';
import { useMovieNextEpisodeQuery } from '@/queries';
import { useMovieStore } from '@/store';
import { formatDate } from '@/utils';
import Image from 'next/image';

export default function ScheduleBadge() {
  const movie = useMovieStore((s) => s.movie);
  const { data: nextEpisodeData } = useMovieNextEpisodeQuery(movie?.id || '');
  const nextEpisode = nextEpisodeData?.data;

  if (!nextEpisode) return null;

  return (
    <div className='mb-8'>
      <div className='bg-blue-party relative flex items-center gap-4 rounded-md bg-[linear-gradient(90deg,#4158D0,#C850C0)] px-4 py-2 text-white'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-black/33 pb-1'>
          <Image
            src={bell}
            alt='Bell'
            width={27}
            height={27}
            className='scale-1.2 object-cover'
            unoptimized
          />
        </div>
        <div>
          <strong>
            Tập {nextEpisode.label}: {nextEpisode.title}
          </strong>
          &nbsp;sẽ phát sóng&nbsp;
          <strong>
            {formatDate(nextEpisode.releaseDate, DEFAULT_DATE_FORMAT)}
          </strong>
          . Các bạn nhớ đón xem nhé 😚
        </div>
      </div>
    </div>
  );
}
