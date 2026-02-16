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
import { useAuth } from '@/hooks';
import WatchDiscussionSkeleton from './watch-discussion-skeleton';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export default function WatchDiscussion({
  isLoading = false
}: {
  isLoading?: boolean;
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
    enabled: !isLoading && !!id && discussionTab === DISCUSSION_TAB_COMMENT
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
    enabled: !isLoading && !!id && discussionTab === DISCUSSION_TAB_REVIEW
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
    discussionTab === DISCUSSION_TAB_COMMENT
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

  if (isLoading) return <WatchDiscussionSkeleton />;

  return (
    <Element name='discussion-watch' id='discussion-watch'>
      <div className='relative block pt-5'>
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
        <Activity visible={discussionTab === DISCUSSION_TAB_COMMENT}>
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
              {discussionTab === DISCUSSION_TAB_COMMENT
                ? 'bình luận'
                : 'đánh giá'}
              .
            </div>
          )}
          <CommentInput isLoading={isActiveLoading} />
        </Activity>
        <Activity visible={discussionTab === DISCUSSION_TAB_COMMENT}>
          <CommentList
            commentList={commentList}
            isLoading={commentListLoading}
            hasMore={!!hasMoreComments}
            remainingCount={remainingComments}
            isLoadMoreLoading={commentLoadMoreLoading}
            onLoadMore={handleLoadMoreComments}
          />
        </Activity>
        <Activity visible={discussionTab === DISCUSSION_TAB_REVIEW}>
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
