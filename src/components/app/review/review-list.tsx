'use client';

import { NoData } from '@/components/no-data';
import ReviewItem from './review-item';
import { ApiResponse, MovieResType, ReviewResType } from '@/types';
import { emptyDiscussion } from '@/assets';
import { StaticImageData } from 'next/image';
import {
  queryKeys,
  reviewRatings,
  REACTION_TYPE_DISLIKE,
  REACTION_TYPE_LIKE
} from '@/constants';
import { useAuth } from '@/hooks';
import {
  useDeleteReviewMutation,
  useVoteReviewListQuery,
  useVoteReviewMutation
} from '@/queries';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { getQueryClient } from '@/components/providers';
import { logger } from '@/logger';
import { notify } from '@/utils';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import Link from 'next/link';
import ReviewItemSkeleton from './review-item-skeleton';

export default function ReviewList({
  reviewList,
  isLoading = false,
  hasMore = false,
  remainingCount = 0,
  isLoadMoreLoading = false,
  onLoadMore
}: {
  reviewList: ReviewResType[];
  isLoading?: boolean;
  hasMore?: boolean;
  remainingCount?: number;
  isLoadMoreLoading?: boolean;
  onLoadMore?: () => void;
}) {
  const { profile, isAuthenticated } = useAuth();
  const queryClient = getQueryClient();
  const { movie, setMovie } = useMovieStore(
    useShallow((s) => ({ movie: s.movie, setMovie: s.setMovie }))
  );

  const reviewRatingMaps: Record<
    number,
    { label: string; icon: StaticImageData }
  > = reviewRatings.reduce(
    (acc, curr) => {
      acc[curr.value as number] = { label: curr.label, icon: curr.icon };
      return acc;
    },
    {} as Record<number, { label: string; icon: StaticImageData }>
  );

  const { data: voteReviewListData } = useVoteReviewListQuery({
    movieId: movie?.id?.toString() || '',
    enabled: isAuthenticated && !!movie?.id
  });

  const voteReviewList = voteReviewListData?.data || [];

  const voteMaps: Record<string, number> = {};
  voteReviewList.forEach((vote) => {
    if (vote.id) {
      voteMaps[vote.id] = vote.type;
    }
  });

  const { mutateAsync: deleteReviewMutate } = useDeleteReviewMutation();
  const { mutateAsync: voteReviewMutate, isPending: voteReviewLoading } =
    useVoteReviewMutation();

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
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    });
  };

  const handleLikeReview = async (id: string) => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để thích đánh giá này
        </span>
      );
      return;
    }

    if (voteReviewLoading) return;

    await voteReviewMutate(
      { id, type: REACTION_TYPE_LIKE },
      {
        onSuccess: async (res) => {
          if (res.result) {
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [queryKeys.REVIEW_LIST]
              }),
              queryClient.invalidateQueries({
                queryKey: [queryKeys.REVIEW_VOTE_LIST, movie?.id?.toString()]
              })
            ]);
          } else {
            notify.error('Thích đánh giá thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while liking review', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  const handleDislikeReview = async (id: string) => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để không thích đánh giá này
        </span>
      );
      return;
    }

    if (voteReviewLoading) return;

    await voteReviewMutate(
      { id, type: REACTION_TYPE_DISLIKE },
      {
        onSuccess: async (res) => {
          if (res.result) {
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [queryKeys.REVIEW_LIST]
              }),
              queryClient.invalidateQueries({
                queryKey: [queryKeys.REVIEW_VOTE_LIST, movie?.id?.toString()]
              })
            ]);
          } else {
            notify.error('Không thích đánh giá thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while disliking review', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  if (isLoading)
    return (
      <div className='mt-12 flex flex-col justify-between gap-8'>
        {Array.from({ length: 3 }).map((_, index) => (
          <ReviewItemSkeleton key={`review-skeleton-${index}`} />
        ))}
      </div>
    );

  if (!reviewList.length)
    return (
      <NoData
        className='bg-background/30 mt-4 min-h-40 rounded-lg px-8 py-12 opacity-50'
        content='Chưa có đánh giá nào'
        size={50}
        src={emptyDiscussion.src}
      />
    );

  return (
    <div className='flex flex-col justify-between'>
      {reviewList
        .filter((review) => review?.id)
        .map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            reviewRatingMaps={reviewRatingMaps}
            isAuthor={profile?.id === review.author?.id}
            isAuthenticated={isAuthenticated}
            isVoteLoading={voteReviewLoading}
            onLike={handleLikeReview}
            onDislike={handleDislikeReview}
            onDelete={handleDeleteReview}
            voteType={voteMaps[review.id]}
          />
        ))}
      {hasMore && (
        <div className='flex justify-center'>
          <Button
            className='hover:text-golden-glow min-w-45 text-sm hover:bg-transparent'
            variant='ghost'
            onClick={onLoadMore}
          >
            {isLoadMoreLoading ? (
              <VerticalBarLoading />
            ) : (
              remainingCount > 0 && `Xem thêm ${remainingCount} đánh giá`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
