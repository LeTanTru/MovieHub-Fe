'use client';

import { NoData } from '@/components/no-data';
import ReviewItem from './review-item';
import { MovieResType, ReviewResType } from '@/types';
import { emptyDiscussion } from '@/assets';
import { StaticImageData } from 'next/image';
import { queryKeys, reviewRatings, REACTION_TYPE_LIKE } from '@/constants';
import { useAuth } from '@/hooks';
import {
  useDeleteReviewMutation,
  useVoteReviewListQuery,
  useVoteReviewMutation
} from '@/queries';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { logger } from '@/logger';
import { invalidateQueries, notify } from '@/utils';
import { route } from '@/routes';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';

const REVIEW_SKELETON_COUNT = 3;

type ReviewListProps = {
  movie: MovieResType;
  reviewList: ReviewResType[];
  isLoading?: boolean;
  hasMore?: boolean;
  remainingCount?: number;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
};

export default function ReviewList({
  movie,
  reviewList,
  isLoading = false,
  hasMore = false,
  remainingCount = 0,
  isLoadingMore = false,
  onLoadMore
}: ReviewListProps) {
  const { profile, isAuthenticated } = useAuth();

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

  const { data: voteReviewList = [] } = useVoteReviewListQuery({
    movieId: movie.id,
    enabled: isAuthenticated && !!movie.id
  });

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
          notify.success('Xóa đánh giá thành công');

          invalidateQueries(
            [queryKeys.REVIEW_LIST, { movieId: movie.id }],
            [queryKeys.CHECK_MOVIE, movie.id],
            [queryKeys.MOVIE, movie.id]
          );
        } else {
          notify.error('Xóa đánh giá thất bại');
        }
      },
      onError: (error) => {
        logger.error('[DELETE_REVIEW_ERROR]', error);
        notify.error('Xóa đánh giá thất bại');
      }
    });
  };

  const handleVote = async (id: string, type: number) => {
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
          &nbsp;để {type === REACTION_TYPE_LIKE ? 'thích' : 'không thích'} đánh
          giá này
        </span>
      );
      return;
    }

    if (voteReviewLoading) return;

    await voteReviewMutate(
      { id, type },
      {
        onSuccess: (res) => {
          if (res.result) {
            invalidateQueries(
              [queryKeys.REVIEW_LIST, { movieId: movie.id }],
              [queryKeys.REVIEW_VOTE_LIST, movie.id]
            );

            const previousVoteType = voteMaps[id];
            const isRemovingVote = previousVoteType === type;

            if (isRemovingVote) {
              notify.success(
                `${type === REACTION_TYPE_LIKE ? 'Bỏ thích' : 'Bỏ không thích'} đánh giá thành công`
              );
            } else if (previousVoteType) {
              notify.success(
                `${type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} đánh giá thành công`
              );
            } else {
              notify.success(
                `${type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} đánh giá thành công`
              );
            }
          } else {
            notify.error(
              `${type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} đánh giá thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error(
            `[${type === REACTION_TYPE_LIKE ? 'LIKE' : 'DISLIKE'}_REVIEW_ERROR]`,
            error
          );

          notify.error(
            `${type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} đánh giá thất bại`
          );
        }
      }
    );
  };

  if (isLoading)
    return (
      <div className='mt-12 flex flex-col justify-between gap-8'>
        {Array.from({ length: REVIEW_SKELETON_COUNT }).map((_, index) => (
          <ReviewItem.Skeleton key={`review-skeleton-${index}`} />
        ))}
      </div>
    );

  if (!reviewList.length)
    return (
      <NoData
        className='bg-background/30 max-640:text-[13px] max-520:text-xs mt-4 min-h-40 rounded-lg px-8 py-12 opacity-50'
        imageClassName='max-640:size-10'
        content={
          <>
            Chưa có đánh giá nào
            <br />
            Hãy trở thành người đầu tiên đánh giá 😊
          </>
        }
        size={50}
        src={emptyDiscussion.src}
      />
    );

  return (
    <div className='max-640:mt-6 max-520:mt-4 mt-8 flex flex-col justify-between gap-4'>
      <AnimatePresence initial={false}>
        {reviewList
          .filter((review) => review?.id)
          .map((review, index) => (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.1,
                ease: 'linear',
                delay: index * 0.05
              }}
              key={review.id}
            >
              <ReviewItem
                review={review}
                reviewRatingMaps={reviewRatingMaps}
                isAuthor={profile?.id === review.author?.id}
                isAuthenticated={isAuthenticated}
                isVoteLoading={voteReviewLoading}
                onVote={handleVote}
                onDelete={handleDeleteReview}
                voteType={voteMaps[review.id]}
              />
            </m.div>
          ))}
      </AnimatePresence>
      {hasMore && (
        <div className='flex justify-center'>
          <Button
            className='hover:text-golden-glow hover:bg-transparent'
            variant='ghost'
            onClick={onLoadMore}
          >
            {isLoadingMore ? (
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
