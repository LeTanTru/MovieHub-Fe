'use client';

import { CommentDotIcon } from '@/assets';
import { route } from '@/routes';
import { getIdFromSlug, renderImageUrl } from '@/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  DEFAULT_PAGE_SIZE,
  discussionActions,
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
import { useAuth, useLoadMore } from '@/hooks';
import DiscussionSkeleton from './discussion-skeleton';
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

export default function Discussion({
  isLoading = false,
  toId,
  className
}: {
  isLoading?: boolean;
  toId: string;
  className?: string;
}) {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const { profile } = useAuth();
  const { discussionTab, setDiscussionTab } = useMovieStore(
    useShallow((s) => ({
      discussionTab: s.discussionTab,
      setDiscussionTab: s.setDiscussionTab
    }))
  );

  const {
    data: commentList,
    isLoading: commentListLoading,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: commentLoadMoreLoading,
    handleLoadMore: handleLoadMoreComments,
    totalElements: totalComments
  } = useLoadMore<HTMLDivElement, CommentSearchType, CommentResType>({
    queryKey: queryKeys.COMMENT_LIST,
    params: {
      movieId: id,
      size: DEFAULT_PAGE_SIZE
    },
    queryFn: commentApiRequest.getList,
    enabled: !isLoading && !!id && discussionTab === DISCUSSION_TAB_COMMENT,
    mode: 'click'
  });

  const {
    data: reviewList,
    isLoading: reviewListLoading,
    hasNextPage: hasMoreReviews,
    isFetchingNextPage: reviewLoadMoreLoading,
    handleLoadMore: handleLoadMoreReviews,
    totalElements: totalReviews
  } = useLoadMore<HTMLDivElement, ReviewSearchType, ReviewResType>({
    queryKey: queryKeys.REVIEW_LIST,
    params: {
      movieId: id,
      size: DEFAULT_PAGE_SIZE
    },
    queryFn: reviewApiRequest.getList,
    enabled: !isLoading && !!id && discussionTab === DISCUSSION_TAB_REVIEW,
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

  const remainingComments = Math.max(
    totalComments - filteredCommentList.length,
    0
  );
  const remainingReviews = Math.max(
    totalReviews - filteredReviewList.length,
    0
  );

  const isActiveLoading =
    discussionTab === DISCUSSION_TAB_COMMENT
      ? commentListLoading
      : reviewListLoading;

  const isCommentTab = discussionTab === DISCUSSION_TAB_COMMENT;
  const isReviewTab = discussionTab === DISCUSSION_TAB_REVIEW;

  if (isLoading) return <DiscussionSkeleton />;

  return (
    <Element name={toId} id={toId}>
      <div className={cn('relative block px-10 py-5', className)}>
        {/* Header */}
        <div className='mb-2 flex items-center font-semibold text-white'>
          <div className='flex grow items-center gap-4'>
            <div className='h-6 w-6'>
              <CommentDotIcon className='h-full w-full' />
            </div>
            <span className='text-base'>
              {
                discussionActions.find((action) => action.key === discussionTab)
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
          <div
            className='relative flex shrink-0 items-center overflow-hidden rounded border border-solid border-white p-0.5 text-sm font-normal'
            role='tablist'
          >
            {discussionActions.map((action) => (
              <ButtonAction
                key={action.key}
                label={action.label}
                action={action.key}
                activeKey={discussionTab}
                setActiveKey={setDiscussionTab}
              />
            ))}
          </div>
        </div>
        {/* Body */}
        <Activity visible={isCommentTab}>
          {profile ? (
            <div className='my-4 flex items-center gap-4'>
              <AvatarField
                src={renderImageUrl(profile.avatarPath)}
                size={50}
                alt={profile.fullName}
              />
              <div className='flex flex-col justify-between gap-1'>
                <span className='text-gray-400'>Bình luận với tên</span>
                <span className='text font-medium text-white'>
                  {profile.fullName}
                </span>
              </div>
            </div>
          ) : (
            <div className='mb-4 text-gray-400'>
              Vui lòng&nbsp;
              <Link
                className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
                href={route.login.path}
              >
                đăng nhập
              </Link>
              &nbsp;để tham gia&nbsp;
              {isCommentTab ? 'bình luận' : 'đánh giá'}.
            </div>
          )}
          <CommentInput isLoading={isActiveLoading} />
        </Activity>
        <Activity visible={isCommentTab}>
          <CommentList
            commentList={filteredCommentList}
            isLoading={commentListLoading}
            hasMore={!!hasMoreComments}
            remainingCount={remainingComments}
            isLoadMoreLoading={commentLoadMoreLoading}
            onLoadMore={handleLoadMoreComments}
          />
        </Activity>
        <Activity visible={isReviewTab}>
          <ReviewList
            reviewList={filteredReviewList}
            isLoading={reviewListLoading}
            hasMore={!!hasMoreReviews}
            remainingCount={remainingReviews}
            isLoadMoreLoading={reviewLoadMoreLoading}
            onLoadMore={handleLoadMoreReviews}
          />
        </Activity>
      </div>
    </Element>
  );
}
