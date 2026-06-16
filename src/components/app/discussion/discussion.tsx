'use client';

import { CommentDotIcon } from '@/assets';
import { buildLoginRedirectPath, renderImageUrl } from '@/utils';
import Link from 'next/link';
import {
  DEFAULT_PAGE_SIZE,
  discussionTabs,
  DISCUSSION_TAB_COMMENT,
  DISCUSSION_TAB_REVIEW,
  queryKeys
} from '@/constants';
import { Activity } from '@/components/activity';
import { AvatarField } from '@/components/form';
import { ButtonAction } from '@/components/app/button-action';
import { CommentInput, CommentList } from '@/components/app/comment';
import { Element } from 'react-scroll';
import { ReviewList } from '@/components/app/review';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useLoadMore, useSlugId } from '@/hooks';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { commentApiRequest, reviewApiRequest } from '@/api-requests';
import {
  CommentResType,
  CommentSearchType,
  ReviewResType,
  ReviewSearchType
} from '@/types';
import { cn } from '@/lib';

const DISCUSSION_SKELETON_COUNT = 3;

type DiscussionProps = {
  toId: string;
  className?: string;
  variant?: 'detail' | 'watch';
};

export function Discussion({
  toId,
  className,
  variant = 'detail'
}: DiscussionProps) {
  const { id } = useSlugId();

  const { profile } = useAuth();
  const { movie, discussionTab, selectedSeason, setDiscussionTab } =
    useMovieStore(
      useShallow((s) => ({
        discussionTab: s.discussionTab,
        movie: s.movie,
        selectedSeason: s.selectedSeason,
        setDiscussionTab: s.setDiscussionTab
      }))
    );

  const {
    data: commentList,
    isLoading: commentListLoading,
    hasMore: hasMoreComments,
    isLoadingMore: isFetchingMoreComments,
    handleLoadMore: handleLoadMoreComments,
    totalElements: totalComments,
    remainingElements: remainingComments
  } = useLoadMore<HTMLDivElement, CommentSearchType, CommentResType>({
    queryKey: queryKeys.COMMENT_LIST,
    params: {
      movieId: id,
      size: DEFAULT_PAGE_SIZE
    },
    queryFn: commentApiRequest.getList,
    enabled: !!id && discussionTab === DISCUSSION_TAB_COMMENT,
    mode: 'click'
  });

  const {
    data: reviewList,
    isLoading: reviewListLoading,
    hasMore: hasMoreReviews,
    isLoadingMore: isFetchingMoreReviews,
    handleLoadMore: handleLoadMoreReviews,
    totalElements: totalReviews,
    remainingElements: remainingReviews
  } = useLoadMore<HTMLDivElement, ReviewSearchType, ReviewResType>({
    queryKey: queryKeys.REVIEW_LIST,
    params: {
      movieId: id,
      size: DEFAULT_PAGE_SIZE
    },
    queryFn: reviewApiRequest.getList,
    enabled: !!id && discussionTab === DISCUSSION_TAB_REVIEW,
    mode: 'click'
  });

  const filteredCommentList = commentList.filter((comment) =>
    Boolean(comment?.id)
  );
  const filteredReviewList = reviewList.filter((review) => Boolean(review?.id));

  const totalMaps: Record<string, number> = {
    [DISCUSSION_TAB_COMMENT]: totalComments,
    [DISCUSSION_TAB_REVIEW]: totalReviews
  };

  const isActiveLoading =
    discussionTab === DISCUSSION_TAB_COMMENT
      ? commentListLoading
      : reviewListLoading;

  const isCommentTab = discussionTab === DISCUSSION_TAB_COMMENT;
  const isReviewTab = discussionTab === DISCUSSION_TAB_REVIEW;

  if (!movie) return null;

  return (
    <Element name={toId} id={toId}>
      <div
        className={cn(
          'max-1120:px-5 max-800:px-0 relative block px-10 py-5',
          { 'max-1120:px-0': variant === 'watch' },
          className
        )}
      >
        {/* Header */}
        <div className='flex items-center font-semibold text-white'>
          <div className='max-640:gap-2 flex grow items-center gap-4'>
            <div className='max-640:size-5 size-6'>
              <CommentDotIcon className='size-full' />
            </div>
            <span className='max-640:text-sm text-base'>
              {
                discussionTabs.find((action) => action.key === discussionTab)
                  ?.label
              }
              &nbsp;(
              {isActiveLoading ? (
                <Skeleton className='skeleton inline-block h-4 w-8 align-middle' />
              ) : (
                totalMaps[discussionTab]
              )}
              )
            </span>
          </div>
          <div className='relative flex shrink-0 items-stretch' role='tablist'>
            {discussionTabs.map((action) => (
              <ButtonAction
                key={action.key}
                label={action.label}
                action={action.key}
                activeTab={discussionTab}
                setActiveTab={setDiscussionTab}
                className='max-640:text-[13px] max-520:text-xs'
              />
            ))}
          </div>
        </div>
        {/* Body */}
        <Activity visible={isCommentTab}>
          {profile ? (
            <div className='max-640:gap-3 max-640:my-3 max-520:mt-2 max-520:gap-2 my-4 flex items-center gap-4'>
              <AvatarField
                src={renderImageUrl(profile.avatarPath)}
                size={40}
                alt={profile.fullName}
                breakpoints={[{ breakpoint: 640, size: 50 }]}
              />
              <div className='max-640:text-[13px] flex flex-col justify-between gap-1'>
                <span className='text-gray-400'>Bình luận với tên</span>
                <span className='line-clamp-2 font-medium text-white'>
                  {profile.fullName}
                </span>
              </div>
            </div>
          ) : (
            <div className='max-640:my-3 my-4 text-gray-400'>
              Vui lòng&nbsp;
              <Link
                className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
                href={buildLoginRedirectPath()}
              >
                đăng nhập
              </Link>
              &nbsp;để tham gia&nbsp;
              {isCommentTab ? 'bình luận' : 'đánh giá'}.
            </div>
          )}
          <CommentInput
            isLoading={isActiveLoading}
            movie={movie}
            selectedSeason={selectedSeason}
          />
        </Activity>
        <Activity visible={isCommentTab}>
          <CommentList
            movie={movie}
            commentList={filteredCommentList}
            isLoading={commentListLoading}
            hasMore={!!hasMoreComments}
            remainingCount={remainingComments}
            isLoadingMore={isFetchingMoreComments}
            onLoadMore={handleLoadMoreComments}
          />
        </Activity>
        <Activity visible={isReviewTab}>
          <ReviewList
            movie={movie}
            reviewList={filteredReviewList}
            isLoading={reviewListLoading}
            hasMore={!!hasMoreReviews}
            remainingCount={remainingReviews}
            isLoadingMore={isFetchingMoreReviews}
            onLoadMore={handleLoadMoreReviews}
          />
        </Activity>
      </div>
    </Element>
  );
}

type DiscussionSkeletonProps = {
  className?: string;
};

Discussion.Skeleton = function ({ className }: DiscussionSkeletonProps) {
  return (
    <div
      className={cn(
        'max-1120:px-5 max-800:px-0 relative block px-10 py-5',
        className
      )}
    >
      <div className='max-640:gap-2 mb-4 flex items-center gap-4 font-semibold text-white'>
        <Skeleton className='skeleton max-640:size-5 size-6 rounded!' />
        <Skeleton className='skeleton max-640:text-sm h-5 w-40 rounded!' />
      </div>
      <div className='max-640:my-3 max-520:mt-2 max-520:gap-2 my-4 flex items-center gap-4'>
        <Skeleton className='skeleton size-10 rounded-full!' />
        <div className='max-640:text-[13px] flex flex-col justify-between gap-1'>
          <Skeleton className='skeleton h-3 w-20 rounded!' />
          <Skeleton className='skeleton h-4 w-32 rounded!' />
        </div>
      </div>
      <Skeleton className='skeleton mb-4 h-25 w-full rounded!' />
      <div className='flex flex-col gap-8'>
        {Array.from({ length: DISCUSSION_SKELETON_COUNT }).map((_, index) => (
          <div
            key={`discussion-skeleton-${index}`}
            className='max-640:gap-3 max-520:gap-2.5 max-480:gap-2 relative flex justify-start gap-4'
          >
            <div className='flex shrink-0 flex-col items-center gap-y-0.5'>
              <Skeleton className='skeleton size-[45px] rounded-full! sm:size-[50px]' />
            </div>
            <div className='grow'>
              {/* Header */}
              <div className='flex h-[26px] items-center gap-2 sm:h-[30px]'>
                <Skeleton className='skeleton h-4 w-24 rounded!' />
                <Skeleton className='skeleton h-4 w-16 rounded!' />
              </div>
              {/* Content */}
              <div className='mt-2 space-y-2'>
                <Skeleton className='skeleton h-4 w-full rounded!' />
                <Skeleton className='skeleton h-4 w-3/4 rounded!' />
              </div>
              {/* Action */}
              <div className='max-640:mt-3 mt-4 flex items-center gap-4'>
                <Skeleton className='skeleton h-4 w-10 rounded!' />
                <Skeleton className='skeleton h-4 w-10 rounded!' />
                <Skeleton className='skeleton h-4 w-14 rounded!' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
