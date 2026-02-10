'use client';

import { NoData } from '@/components/no-data';
import ReviewItem, { ReviewItemSkeleton } from './review-item';
import { ApiResponse, MovieResType, ReviewResType } from '@/types';
import { emptyDiscussion } from '@/assets';
import { StaticImageData } from 'next/image';
import { useMemo } from 'react';
import { queryKeys, reviewRatings } from '@/constants';
import { useAuth } from '@/hooks';
import { useDeleteReviewMutation } from '@/queries';
import { logger } from '@/logger';
import { notify } from '@/utils';
import { getQueryClient } from '@/components/providers';
import { useMovieStore } from '@/store';

export default function ReviewList({
  reviews,
  isLoading = false
}: {
  reviews: ReviewResType[];
  isLoading?: boolean;
}) {
  const { profile } = useAuth();
  const queryClient = getQueryClient();
  const movie = useMovieStore((s) => s.movie);
  const setMovie = useMovieStore((s) => s.setMovie);

  const reviewRatingMaps: Record<
    number,
    { label: string; icon: StaticImageData }
  > = useMemo(() => {
    return reviewRatings.reduce(
      (acc, curr) => {
        acc[curr.value as number] = { label: curr.label, icon: curr.icon };
        return acc;
      },
      {} as Record<number, { label: string; icon: StaticImageData }>
    );
  }, []);

  const { mutateAsync: deleteReviewMutate } = useDeleteReviewMutation();

  const handleDeleteReview = async (id: string) => {
    await deleteReviewMutate(id, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Xoá đánh giá thành công');

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [queryKeys.REVIEW_LIST]
            }),
            queryClient.invalidateQueries({
              queryKey: [queryKeys.CHECK_MOVIE, movie?.id?.toString()]
            }),
            queryClient.invalidateQueries({
              queryKey: [queryKeys.MOVIE, movie?.id?.toString()]
            })
          ]);
          const newMovieData = queryClient.getQueryData<
            ApiResponse<MovieResType>
          >([queryKeys.MOVIE, movie?.id?.toString()]);
          const newMovie = newMovieData?.data;
          setMovie(newMovie);
        } else {
          notify.error('Xoá đánh giá thất bại');
        }
      },
      onError: (error) => {
        logger.error('Error while deleting review', error);
      }
    });
  };

  if (isLoading)
    return (
      <div className='mt-12 flex flex-col justify-between gap-8'>
        {Array.from({ length: 3 }).map((_, index) => (
          <ReviewItemSkeleton key={`review-skeleton-${index}`} />
        ))}
      </div>
    );

  if (!reviews.length)
    return (
      <NoData
        className='dark:bg-background/30 mt-4 min-h-30 rounded-lg px-8 py-12 opacity-50 dark:text-transparent'
        content='Chưa có đánh giá nào'
        size={50}
        src={emptyDiscussion.src}
      />
    );

  return (
    <div className='mt-12 flex flex-col justify-between gap-8'>
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          reviewRatingMaps={reviewRatingMaps}
          isAuthor={profile?.id === review.author.id}
          onDelete={handleDeleteReview}
        />
      ))}
    </div>
  );
}
