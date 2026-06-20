'use client';

import { ReviewModal } from './review-modal';
import {
  useAuth,
  useDisclosure,
  useMovie,
  useValidatePermission
} from '@/hooks';
import { apiConfig } from '@/constants';
import { cn } from '@/lib';
import { useCheckMovieQuery } from '@/queries';
import { buildLoginRedirectPath, formatRating, notify } from '@/utils';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa6';

type ButtonReviewProps = {
  movieId: string;
  className?: string;
};

export function ButtonReview({ movieId, className }: ButtonReviewProps) {
  const { isAuthenticated } = useAuth();
  const hasPermission = useValidatePermission();

  const canCreate =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.review.create.permissionCode]
    });

  const { opened, open, close } = useDisclosure();

  const { movie } = useMovie();

  const { data: isReviewed } = useCheckMovieQuery({
    movieId: movieId,
    enabled: !!movieId && canCreate
  });

  const handleOpenReviewModal = () => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={buildLoginRedirectPath()}
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

  if (!movie || !canCreate) return null;

  return (
    <>
      <div
        className={cn(
          'relative flex flex-col items-end gap-2 text-white',
          className
        )}
      >
        <button
          type='button'
          className='bg-dark-conflower-blue flex cursor-pointer items-center rounded-full px-2.5 py-2 transition-all duration-200 ease-linear hover:opacity-80'
          onClick={handleOpenReviewModal}
        >
          <FaStar className='mr-2 size-4' />
          <span
            className={cn('rating font-bold', {
              'mr-2': !isReviewed
            })}
          >
            {formatRating(movie.averageRating || 0)}
          </span>
          {!isReviewed && (
            <span className='content whitespace-nowrap underline'>
              Đánh giá
            </span>
          )}
        </button>
      </div>
      <ReviewModal opened={opened} movie={movie} onClose={close} />
    </>
  );
}
