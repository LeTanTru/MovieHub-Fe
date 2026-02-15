'use client';

import { CommentDotIcon } from '@/assets';
import {
  useInfiniteCommentListQuery,
  useInfiniteReviewListQuery
} from '@/queries';
import { route } from '@/routes';
import { getIdFromSlug, renderImageUrl } from '@/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  DEFAULT_PAGE_SIZE,
  discussionActions,
  DISCUSSION_TAB_COMMENT,
  DISCUSSION_TAB_REVIEW,
  queryKeys
} from '@/constants';
import { AvatarField } from '@/components/form';
import { Activity } from '@/components/activity';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonAction } from '@/components/app/button-action';
import { useAuth } from '@/hooks';
import { Element } from 'react-scroll';
import { CommentInput, CommentList } from '@/components/app/comment';
import { ReviewList } from '@/components/app/review';

const DiscussionSkeleton = () => {
  return (
    <div className='relative block px-10 py-5'>
      <div className='mb-4 flex items-center justify-between'>
        <Skeleton className='skeleton h-5 w-40 rounded' />
        <Skeleton className='skeleton h-8 w-32 rounded' />
      </div>
      <div className='mb-6'>
        <Skeleton className='skeleton mb-4 h-16 w-full rounded' />
        <div className='mt-12 flex flex-col gap-8'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`discussion-skeleton-${index}`} className='flex gap-4'>
              <Skeleton className='skeleton h-12.5 w-12.5 rounded-full' />
              <div className='flex grow flex-col gap-3'>
                <Skeleton className='skeleton h-4 w-40 rounded' />
                <Skeleton className='skeleton h-4 w-full rounded' />
                <Skeleton className='skeleton h-4 w-3/4 rounded' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Discussion({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const [activeKey, setActiveKey] = useState<string>(DISCUSSION_TAB_COMMENT);
  const { profile } = useAuth();

  const {
    data: commentListData,
    isLoading: commentListLoading,
    hasNextPage: hasMoreComments,
    fetchNextPage: fetchMoreComments,
    isFetchingNextPage: commentLoadMoreLoading
  } = useInfiniteCommentListQuery({
    params: {
      movieId: id,
      size: DEFAULT_PAGE_SIZE
    },
    queryKey: queryKeys.COMMENT_LIST,
    enabled: !isLoading && !!id && activeKey === DISCUSSION_TAB_COMMENT
  });

  const {
    data: reviewListData,
    isLoading: reviewListLoading,
    hasNextPage: hasMoreReviews,
    fetchNextPage: fetchMoreReviews,
    isFetchingNextPage: reviewLoadMoreLoading
  } = useInfiniteReviewListQuery({
    params: {
      movieId: id,
      size: DEFAULT_PAGE_SIZE
    },
    enabled: !isLoading && !!id && activeKey === DISCUSSION_TAB_REVIEW
  });

  const commentList = (
    commentListData?.pages?.flatMap(
      (pageData) => pageData.data.content || []
    ) || []
  ).filter((comment) => Boolean(comment?.id));

  const reviewList = (
    reviewListData?.pages?.flatMap((pageData) => pageData.data.content || []) ||
    []
  ).filter((review) => Boolean(review?.id));

  const totalMaps: Record<string, number> = {
    [DISCUSSION_TAB_COMMENT]:
      commentListData?.pages?.[0]?.data?.totalElements || 0,
    [DISCUSSION_TAB_REVIEW]:
      reviewListData?.pages?.[0]?.data?.totalElements || 0
  };
  const remainingComments = Math.max(
    totalMaps[DISCUSSION_TAB_COMMENT] - commentList.length,
    0
  );
  const remainingReviews = Math.max(
    totalMaps[DISCUSSION_TAB_REVIEW] - reviewList.length,
    0
  );

  const isActiveLoading =
    activeKey === DISCUSSION_TAB_COMMENT
      ? commentListLoading
      : reviewListLoading;

  const handleLoadMoreComments = () => {
    if (!hasMoreComments || commentLoadMoreLoading) return;
    fetchMoreComments();
  };

  const handleLoadMoreReviews = () => {
    if (!hasMoreReviews || reviewLoadMoreLoading) return;
    fetchMoreReviews();
  };

  if (isLoading) return <DiscussionSkeleton />;

  return (
    <Element name='discussion'>
      <div className='relative block px-10 py-5'>
        {/* Header */}
        <div className='flex items-center font-semibold text-white'>
          <div className='flex grow gap-2'>
            <div className='h-6 w-6'>
              <CommentDotIcon />
            </div>
            <span>
              {
                discussionActions.find((action) => action.key === activeKey)
                  ?.label
              }
              &nbsp;(
              {isActiveLoading ? (
                <Skeleton className='skeleton inline-block h-4 w-8 align-middle' />
              ) : (
                totalMaps[activeKey]
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
                activeKey={activeKey}
                setActiveKey={setActiveKey}
              />
            ))}
          </div>
        </div>
        {/* Body */}
        <Activity visible={activeKey === DISCUSSION_TAB_COMMENT}>
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
                className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
                href={route.login.path}
              >
                đăng nhập
              </Link>
              &nbsp;để tham gia&nbsp;
              {activeKey === DISCUSSION_TAB_COMMENT ? 'bình luận' : 'đánh giá'}.
            </div>
          )}
          <CommentInput isLoading={isActiveLoading} />
        </Activity>
        <Activity visible={activeKey === DISCUSSION_TAB_COMMENT}>
          <CommentList
            commentList={commentList}
            isLoading={commentListLoading}
            hasMore={!!hasMoreComments}
            remainingCount={remainingComments}
            isLoadMoreLoading={commentLoadMoreLoading}
            onLoadMore={handleLoadMoreComments}
          />
        </Activity>
        <Activity visible={activeKey === DISCUSSION_TAB_REVIEW}>
          <ReviewList
            reviewList={reviewList}
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
