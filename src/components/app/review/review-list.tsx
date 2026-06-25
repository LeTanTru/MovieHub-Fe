'use client';

import { NoData } from '@/components/no-data';
import { ReviewItem } from './review-item';
import { MovieResType, ReviewResType } from '@/types';
import { emptyDiscussion } from '@/assets';
import { StaticImageData } from 'next/image';
import {
  apiConfig,
  queryKeys,
  reviewRatings,
  REACTION_TYPE_LIKE
} from '@/constants';
import { useAuth, useValidatePermission } from '@/hooks';
import {
  useDeleteReviewMutation,
  useVoteReviewListQuery,
  useVoteReviewMutation
} from '@/queries';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { logger } from '@/logger';
import { buildLoginRedirectPath, invalidateQueries, notify } from '@/utils';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReviewStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import ReviewReportModal from './review-report-modal';

type ReviewListProps = {
  movie: MovieResType;
  reviewList: ReviewResType[];
  hasMore?: boolean;
  remainingCount?: number;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  animationKey?: string;
};

export function ReviewList({
  movie,
  reviewList,
  hasMore = false,
  remainingCount = 0,
  isLoadingMore = false,
  onLoadMore,
  animationKey
}: ReviewListProps) {
  const { profile, isAuthenticated } = useAuth();
  const hasPermission = useValidatePermission();
  const [selectedReportReviewId, setSelectedReportReviewId] = useState<
    string | null
  >(null);

  const { targetReviewId, clearScrollTarget } = useReviewStore(
    useShallow((s) => ({
      targetReviewId: s.targetReviewId,
      clearScrollTarget: s.clearScrollTarget
    }))
  );

  useEffect(() => {
    if (!targetReviewId || isLoadingMore || !hasMore) return;

    if (reviewList.some((review) => review.id === targetReviewId)) return;

    onLoadMore?.();
  }, [reviewList, hasMore, isLoadingMore, onLoadMore, targetReviewId]);

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

  const { mutate: deleteReview } = useDeleteReviewMutation();
  const { mutate: voteReview, isPending } = useVoteReviewMutation();

  const canVote =
    isAuthenticated &&
    !isPending &&
    hasPermission({
      requiredPermissions: [apiConfig.review.vote.permissionCode]
    });

  const canDelete =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.review.delete.permissionCode]
    });

  const canReport =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.userReport.create.permissionCode]
    });

  const handleOpenReportModal = (reviewId: string) => {
    setSelectedReportReviewId(reviewId);
  };

  const handleCloseReportModal = () => {
    setSelectedReportReviewId(null);
  };

  const handleDeleteReview = (id: string) => {
    deleteReview(id, {
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

  const handleVote = (id: string, type: number) => {
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
          &nbsp;để {type === REACTION_TYPE_LIKE ? 'thích' : 'không thích'} đánh
          giá này
        </span>
      );
      return;
    }

    if (isPending) return;

    voteReview(
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
    <>
      <div className='flex flex-col justify-between gap-4'>
        <div className='flex flex-col gap-4' key={animationKey}>
          <AnimatePresence>
            {reviewList
              .filter((review) => review?.id)
              .map((review, index) => (
                <m.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12, height: 0, overflow: 'hidden' }}
                  transition={{
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                    delay: Math.min(index * 0.03, 0.3)
                  }}
                  key={review.id}
                >
                  <ReviewItem
                    review={review}
                    reviewRatingMaps={reviewRatingMaps}
                    isAuthor={profile?.id === review.author?.id}
                    canDelete={canDelete}
                    canReport={canReport}
                    canVote={canVote}
                    onVote={handleVote}
                    onDelete={handleDeleteReview}
                    onOpenReportModal={handleOpenReportModal}
                    voteType={voteMaps[review.id]}
                    targetReviewId={targetReviewId}
                    clearScrollTarget={clearScrollTarget}
                  />
                </m.div>
              ))}
          </AnimatePresence>
        </div>
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
                remainingCount > 0 && `Xem thêm (${remainingCount}) đánh giá`
              )}
            </Button>
          </div>
        )}
      </div>
      {canReport && (
        <ReviewReportModal
          open={!!selectedReportReviewId}
          onClose={handleCloseReportModal}
          reviewId={selectedReportReviewId ?? ''}
        />
      )}
    </>
  );
}
