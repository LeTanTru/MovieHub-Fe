'use client';

import { AvatarField } from '@/components/form';
import {
  DEFAULT_PAGE_SIZE,
  GENDER_OTHER,
  genderIconMaps,
  kindMaps,
  queryKeys,
  STATUS_HIDE
} from '@/constants';
import { useClickOutside, useLoadMore } from '@/hooks';
import { CommentResType, CommentSearchType } from '@/types';
import { renderImageUrl } from '@/utils';
import { ReactNode, useState } from 'react';
import { commentApiRequest } from '@/api-requests';
import { getQueryClient } from '@/components/providers/query-provider';
import CommentHeader from './comment-header';
import CommentContent from './comment-content';
import CommentReply from './comment-reply';
import CommentReplyList from './comment-reply-list';
import CommentAction from './comment-action';
import { Skeleton } from '@/components/ui/skeleton';

type CommentItemProps = {
  comment: CommentResType & { children?: CommentResType[] };
  editingComment: CommentResType | null;
  isAuthenticated: boolean;
  isVoteLoading: boolean;
  level: number;
  openParentIds: string[];
  replyingComment: CommentResType | null;
  rootId: string;
  userId: string;
  voteMap: Record<string, number>;
  onCloseReplyAction: () => void;
  onDeleteAction: (id: string) => void;
  onVoteAction: (id: string, type: number, onSuccess?: () => void) => void;
  openReplyAction: (replyingComment: CommentResType | null) => void;
  renderChildrenAction: (
    list: CommentResType[],
    level: number,
    rootId?: string
  ) => ReactNode;
  setEditingCommentAction: (editingComment: CommentResType | null) => void;
  setOpenParentIdsAction: (
    ids: string[] | ((prev: string[]) => string[])
  ) => void;
};

export default function CommentItem({
  comment,
  editingComment,
  isAuthenticated,
  isVoteLoading,
  level,
  openParentIds,
  replyingComment,
  rootId,
  userId,
  voteMap,
  onCloseReplyAction,
  onDeleteAction,
  onVoteAction,
  openReplyAction,
  renderChildrenAction,
  setEditingCommentAction,
  setOpenParentIdsAction
}: CommentItemProps) {
  const author = comment.author;
  const isAuthor = userId && author.id ? userId === author.id : false;
  const kind = author.kind !== undefined ? kindMaps[author.kind] : undefined;
  const replyToInfo = comment.replyTo;

  const gender = author.gender || GENDER_OTHER;
  const GenderIcon = genderIconMaps[gender];

  const movieItem = comment.movieItem;

  const queryClient = getQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBlurredContent, setShowBlurredContent] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const isHiddenComment = comment.status === STATUS_HIDE;

  const isActiveParent = openParentIds.includes(comment.id);

  const {
    data: commentList,
    isLoading: commentListLoading,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: commentLoadMoreLoading,
    handleLoadMore: handleFetchNextPage
  } = useLoadMore<HTMLDivElement, CommentSearchType, CommentResType>({
    params: {
      movieId: comment.movieId,
      parentId: comment.id,
      size: DEFAULT_PAGE_SIZE
    },
    queryKey: `${queryKeys.COMMENT_LIST}-replies-${comment.id}`,
    queryFn: commentApiRequest.getList,
    enabled: isActiveParent,
    mode: 'click'
  });

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleReplySubmit = async () => {
    onCloseReplyAction();
    await queryClient.invalidateQueries({
      queryKey: [queryKeys.COMMENT_LIST]
    });
    const parentIdToInvalidate = level === 0 ? comment.id : rootId;
    setOpenParentIdsAction((prev) => [...prev, parentIdToInvalidate]);
    await queryClient.invalidateQueries({
      queryKey: [`${queryKeys.COMMENT_LIST}-replies-${parentIdToInvalidate}`]
    });
  };

  const handleReplyComment = () => {
    if (replyingComment?.id === comment.id) {
      onCloseReplyAction();
    } else {
      openReplyAction(comment);
    }
    setEditingCommentAction(null);
  };

  const handleEditComment = (comment: CommentResType) => {
    setShowDropdown(false);
    if (editingComment?.id === comment.id) {
      setEditingCommentAction(null);
      return;
    }
    setEditingCommentAction(comment);
    onCloseReplyAction();
  };

  const handleDeleteComment = () => {
    setShowDropdown(false);
    onDeleteAction(comment.id);
    // If the comment list has only one element, it means it's the last comment
    // So we need to close the parent comment after deleting the comment
    if (commentList.length === 1) {
      setOpenParentIdsAction((prev) =>
        prev.filter((id) => id !== (level === 0 ? comment.id : rootId))
      );
    }
  };

  const handleCancel = () => {
    onCloseReplyAction();
    setEditingCommentAction(null);
  };

  const renderMention = () => {
    if (!replyToInfo?.fullName) return;

    const mention = `@${replyToInfo?.fullName}`;

    return (
      <>
        <span className='max-640:px-0.75 max-640:py-px rounded bg-slate-700 px-1.25 py-0.75 font-medium text-gray-200'>
          {mention}
        </span>
        &nbsp;
      </>
    );
  };

  const handleViewReplies = (parentId: string) => {
    setOpenParentIdsAction((prev) => [...prev, parentId]);
  };

  const handleHideReplies = (parentId: string) => {
    setOpenParentIdsAction((prev) =>
      prev.filter((value) => value !== parentId)
    );
  };

  const handleToggleBlurredContent = () => {
    setShowBlurredContent((prev) => !prev);
    setShowDropdown(false);
  };

  const handleVote = (id: string, type: number) => {
    onVoteAction(id, type, async () => {
      if (comment.parent)
        await queryClient.invalidateQueries({
          queryKey: [`${queryKeys.COMMENT_LIST}-replies-${comment.parent?.id}`]
        });
      else
        await queryClient.invalidateQueries({
          queryKey: [queryKeys.COMMENT_LIST]
        });
    });
  };

  const showMore = isHiddenComment || isAuthor;

  return (
    <div className='max-640:gap-3 max-520:gap-2.5 max-480:gap-2 relative flex justify-start gap-4'>
      <div className='flex flex-col items-center gap-y-0.5'>
        <AvatarField
          src={renderImageUrl(author.avatarPath)}
          size={45}
          alt={author.fullName}
          breakpoints={[{ breakpoint: 640, size: 50 }]}
        />
        {isAuthor && (
          <span className='max-640:block text-golden-glow max-640:text-[13px] max-520:text-xs hidden font-semibold'>
            Bạn
          </span>
        )}
      </div>
      <div className='grow'>
        <CommentHeader
          comment={comment}
          isAuthor={isAuthor}
          kind={kind}
          gender={gender}
          GenderIcon={GenderIcon}
          author={author}
          movieItem={movieItem}
        />

        <CommentContent
          comment={comment}
          isHiddenComment={isHiddenComment}
          showBlurredContent={showBlurredContent}
          onToggleBlurredContent={handleToggleBlurredContent}
          renderMention={renderMention}
        />
        <CommentAction
          comment={comment}
          level={level}
          isAuthenticated={isAuthenticated}
          isAuthor={isAuthor}
          isVoteLoading={isVoteLoading}
          isHiddenComment={isHiddenComment}
          showBlurredContent={showBlurredContent}
          showDropdown={showDropdown}
          showMore={showMore}
          voteMap={voteMap}
          dropdownRef={dropdownRef}
          onVote={handleVote}
          onReply={handleReplyComment}
          onEdit={() => handleEditComment(comment)}
          onToggleDropdown={handleDropdownToggle}
          onToggleBlurredContent={handleToggleBlurredContent}
          onDelete={handleDeleteComment}
        />

        <CommentReply
          comment={comment}
          rootId={rootId}
          author={author}
          replyingComment={replyingComment}
          editingComment={editingComment}
          onReplySubmit={handleReplySubmit}
          onCancel={handleCancel}
        />

        <CommentReplyList
          comment={comment}
          level={level}
          rootId={rootId}
          isActiveParent={isActiveParent}
          commentList={commentList}
          commentListLoading={commentListLoading}
          commentLoadMoreLoading={commentLoadMoreLoading}
          hasMoreComments={!!hasMoreComments}
          onViewReplies={() => handleViewReplies(comment.id)}
          onHideReplies={() => handleHideReplies(comment.id)}
          onFetchMoreReplies={handleFetchNextPage}
          renderChildren={renderChildrenAction}
        />
      </div>
    </div>
  );
}

CommentItem.Skeleton = function () {
  return (
    <div className='flex justify-start gap-4'>
      <Skeleton className='skeleton h-12.5 w-12.5 rounded-full!' />
      <div className='flex grow flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <Skeleton className='skeleton h-4 w-24 rounded!' />
          <Skeleton className='skeleton h-4 w-16 rounded!' />
        </div>
        <Skeleton className='skeleton h-4 w-full rounded!' />
        <Skeleton className='skeleton h-4 w-3/4 rounded!' />
        <div className='flex items-center gap-3'>
          <Skeleton className='skeleton h-4 w-10 rounded!' />
          <Skeleton className='skeleton h-4 w-10 rounded!' />
          <Skeleton className='skeleton h-4 w-14 rounded!' />
        </div>
      </div>
    </div>
  );
};
