'use client';

import { NoData } from '@/components/no-data';
import ReviewItem from './review-item';
import {
  ApiResponse,
  MovieResType,
  ReviewResType,
  ReviewVoteResType
} from '@/types';
import { emptyDiscussion } from '@/assets';
import { StaticImageData } from 'next/image';
import {
  queryKeys,
  reviewRatings,
  REACTION_TYPE_LIKE,
  EMPTY_ARRAY,
  EMPTY_OBJECT
} from '@/constants';
import { useAuth } from '@/hooks';
import {
  useDeleteReviewMutation,
  useVoteReviewListQuery,
  useVoteReviewMutation
} from '@/queries';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { getQueryClient } from '@/components/providers/query-provider';
import { logger } from '@/logger';
import { notify } from '@/utils';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';

type ReviewListProps = {
  reviewList: ReviewResType[];
  isLoading?: boolean;
  hasMore?: boolean;
  remainingCount?: number;
  isLoadMoreLoading?: boolean;
  onLoadMore?: () => void;
};

export default function ReviewList({
  reviewList,
  isLoading = false,
  hasMore = false,
  remainingCount = 0,
  isLoadMoreLoading = false,
  onLoadMore
}: ReviewListProps) {
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
    movieId: movie?.id || '',
    enabled: isAuthenticated && !!movie?.id
  });

  const voteReviewList = voteReviewListData?.data || EMPTY_ARRAY;

  const voteMaps: Record<string, number> = EMPTY_OBJECT;
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
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [queryKeys.REVIEW_LIST, movie?.id]
            }),
            queryClient.invalidateQueries({
              queryKey: [queryKeys.CHECK_MOVIE, movie?.id]
            }),
            queryClient.invalidateQueries({
              queryKey: [queryKeys.MOVIE, movie?.id]
            })
          ]);

          const newMovieData = queryClient.getQueryData<
            ApiResponse<MovieResType>
          >([queryKeys.MOVIE, movie?.id]);
          const newMovie = newMovieData?.data;

          setMovie(newMovie);

          notify.success('Xóa đánh giá thành công');
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
        onSuccess: async (res) => {
          if (res.result) {
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [queryKeys.REVIEW_LIST, { movieId: movie?.id }]
              }),
              queryClient.invalidateQueries({
                queryKey: [queryKeys.REVIEW_VOTE_LIST, movie?.id]
              })
            ]);

            const voteList = queryClient.getQueryData<
              ApiResponse<ReviewVoteResType[]>
            >([queryKeys.REVIEW_VOTE_LIST, movie?.id]);

            const vote = (voteList?.data || EMPTY_ARRAY).find(
              (v) => v.id === id
            );

            if (vote) {
              notify.success(
                `${vote.type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} đánh giá thành công`
              );
            } else {
              notify.success(
                `${type === REACTION_TYPE_LIKE ? 'Bỏ thích' : 'Bỏ không thích'} đánh giá thành công`
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
        {Array.from({ length: 3 }).map((_, index) => (
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
