import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa6';
import { route } from '@/routes';
import { MovieResType } from '@/types';

type Props = {
  movie: MovieResType;
  videoTitle: string;
};

export default function WatchPlayerHeader({ movie, videoTitle }: Props) {
  return (
    <div className='max-1360:mb-4 max-1360:px-6 max-1120:px-4 max-800:mb-2 max-640:mt-4 max-640:mb-0 mb-6 inline-flex w-full items-center gap-2 px-8'>
      <Link
        href={`${route.movie.path}/${movie.slug}.${movie.id}`}
        className='max-1120:p-1.5 max-640:p-1 rounded-full border border-solid border-gray-200 p-2 opacity-50 transition-all duration-200 ease-linear hover:opacity-100'
      >
        <FaChevronLeft />
      </Link>
      <h3 className='max-1120:font-semibold max-1120:text-lg max-640:text-sm text-xl font-bold'>
        Xem phim {videoTitle}
      </h3>
    </div>
  );
}
