'use client';

import ReviewModal from './review-modal';
import { useAuth, useDisclosure } from '@/hooks';
import { cn } from '@/lib';
import { useCheckMovieQuery } from '@/queries';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { formatRating, notify } from '@/utils';
import Link from 'next/link';
import { useShallow } from 'zustand/shallow';

export default function ButtonReview({
  movieId,
  className
}: {
  movieId: string;
  className?: string;
}) {
  const { opened, open, close } = useDisclosure();
  const { isAuthenticated } = useAuth();

  const { movie } = useMovieStore(
    useShallow((s) => ({
      movie: s.movie
    }))
  );

  const { data: checkMovieData } = useCheckMovieQuery({
    movieId: movieId,
    enabled: !!movieId && isAuthenticated
  });

  const isReviewed = checkMovieData?.result && checkMovieData.data;

  const handleOpenReviewModal = () => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để đánh giá phim
        </span>
      );
      return;
    }

    if (isReviewed) {
      notify.info('Bạn đã đánh giá phim này rồi');
      return;
    }

    open();
  };

  if (!movie) return null;

  return (
    <>
      <div
        className={cn(
          'relative flex flex-col items-end gap-2 text-white',
          className
        )}
      >
        <div
          className='bg-review flex cursor-pointer items-center rounded-full px-2.5 py-2 transition-all duration-200 ease-linear hover:opacity-80'
          onClick={handleOpenReviewModal}
        >
          <div className='h-6 w-6 bg-[url(/logo.webp)] bg-cover bg-position-[50%]'></div>
          <span className='mr-2 ml-1 font-bold'>
            {formatRating(movie?.averageRating || 0)}
            &nbsp;({movie.reviewCount})
          </span>
          {!isReviewed && <span className='text-xs underline'>Đánh giá</span>}
        </div>
      </div>
      <ReviewModal opened={opened} onClose={close} />
    </>
  );
}
