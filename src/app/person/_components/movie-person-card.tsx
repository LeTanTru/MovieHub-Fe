'use client';

import { apiConfig } from '@/constants';
import route from '@/routes';
import { MoviePersonResType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function MoviePersonCard({
  moviePerson
}: {
  moviePerson: MoviePersonResType;
}) {
  return (
    <div className='relative flex flex-col gap-3'>
      <Link
        className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-[8px] pb-[150%]'
        href={`${route.movie}/${moviePerson.id}`}
      >
        <div>
          <Image
            fill
            src={`${apiConfig.imageProxy.baseUrl}${moviePerson.movie.thumbnailUrl}`}
            alt={moviePerson.movie.title}
            className='absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
          />
        </div>
      </Link>
      <div className='min-h-10.5 text-center'>
        <h4 className='hover:text-light-golden-yellow mb-0 line-clamp-1 text-sm leading-6 font-normal text-white transition-all duration-200 ease-linear'>
          <Link href={`${route.movie}/${moviePerson.id}`}>
            {moviePerson.movie.title}
          </Link>
        </h4>
        <h4 className='text-light-gray mt-[5px] line-clamp-1 text-xs leading-6'>
          <Link href={`/movie/${moviePerson.id}`}>
            {moviePerson.movie.originalTitle}
          </Link>
        </h4>
      </div>
    </div>
  );
}
