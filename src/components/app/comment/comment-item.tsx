'use client';

import { AvatarField } from '@/components/form';
import {
  DEFAULT_PAGE_SIZE,
  GENDER_OTHER,
  genderIconMaps,
  KIND_ADMIN,
  kindMaps,
  queryKeys,
  STATUS_HIDE
} from '@/constants';
import { cn } from '@/lib';
import { CommentAction } from './comment-action';
import { commentApiRequest } from '@/api-requests';
import { CommentContent } from './comment-content';
import { CommentHeader } from './comment-header';
import { CommentReplyForm } from './comment-reply-form';
import { CommentReplyList } from './comment-reply-list';
import { CommentResType, CommentSearchType, ToxicSpan } from '@/types';
import { Element, scroller } from 'react-scroll';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { renderImageUrl, invalidateQueries, parseJSON } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useClickOutside, useLoadMore } from '@/hooks';

const SCROLL_DELAY = 100;
const HIGHLIGHT_DURATION = 2000;

type CommentItemProps = {
  comment: CommentResType & { children?: CommentResType[] };
  editingComment: CommentResType | null;
  level: number;
  openParentIds: string[];
  replyingComment: CommentResType | null;
  targetCommentId: string | null;
  targetParentId: string | null;
  rootId: string;
  userId: string;
  voteMap: Record<string, number>;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canReport: boolean;
  canVote: boolean;
  onCloseReply: () => void;
  onDelete: (id: string) => void;
  onOpenReportModal: (commentId: string) => void;
  onVote: (id: string, type: number, onSuccess?: () => void) => void;
  openReply: (replyingComment: CommentResType | null) => void;
  renderChildren: (
    list: CommentResType[],
    level: number,
    rootId?: string
  ) => ReactNode;
  setEditingComment: (editingComment: CommentResType | null) => void;
  setOpenParentIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  clearScrollTarget: () => void;
};

export function CommentItem({
  comment,
  editingComment,
  level,
  openParentIds,
  replyingComment,
  targetCommentId,
  targetParentId,
  rootId,
  userId,
  voteMap,
  canCreate,
  canUpdate,
  canDelete,
  canReport,
  canVote,
  onCloseReply,
  onDelete,
  onOpenReportModal,
  onVote,
  openReply,
  renderChildren,
  setEditingComment,
  setOpenParentIds,
  clearScrollTarget
}: CommentItemProps) {
  const author = comment.author;
  const isAuthor = userId && author.id ? userId === author.id : false;
  const isAdmin = author.kind === KIND_ADMIN;

  const kind = author.kind !== undefined ? kindMaps[author.kind] : undefined;
  const replyToInfo = comment.replyTo;

  const gender = author.gender || GENDER_OTHER;
  const GenderIcon = genderIconMaps[gender];

  const movieItem = comment.movieItem;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const isHidden = comment.status === STATUS_HIDE;

  const isActiveParent = openParentIds.includes(comment.id);

  const scrollTargetName = useMemo(() => `comment-${comment.id}`, [comment.id]); // unique name for scroll target

  const [isScrollTarget, setIsScrollTarget] = useState(false); // state to trigger highlight effect

  const toxicSpans = comment.toxicSpans
    ? parseJSON<ToxicSpan[]>(comment.toxicSpans) || []
    : [];
  const hasToxicSpans = toxicSpans.length > 0;
  const [isVisible, setIsVisible] = useState(false);
  const canViewHiddenContent = isHidden || !!hasToxicSpans;
  const isBlurWholeContent = isHidden && !isVisible && !hasToxicSpans;

  const {
    data: commentList,
    isLoading,
    hasMore,
    isLoadingMore,
    handleLoadMore
  } = useLoadMore<HTMLDivElement, CommentSearchType, CommentResType>({
    params: {
      movieId: comment.movieId,
      parentId: comment.id,
      size: DEFAULT_PAGE_SIZE
    },
    queryKey: `${queryKeys.COMMENT_REPLIES_LIST}-${comment.id}`,
    queryFn: commentApiRequest.getList,
    enabled: isActiveParent,
    mode: 'click'
  });

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleReplySubmit = async () => {
    onCloseReply();
    invalidateQueries([queryKeys.COMMENT_LIST, { movieId: comment.movieId }]);
    const parentIdToInvalidate = level === 0 ? comment.id : rootId;
    setOpenParentIds((prev) => [...prev, parentIdToInvalidate]);
    invalidateQueries([
      `${queryKeys.COMMENT_REPLIES_LIST}-${parentIdToInvalidate}`
    ]);
  };

  const handleReplyComment = () => {
    if (replyingComment?.id === comment.id) {
      onCloseReply();
    } else {
      openReply(comment);
    }
    setEditingComment(null);
  };

  const handleEditComment = (comment: CommentResType) => {
    setShowDropdown(false);
    if (editingComment?.id === comment.id) {
      setEditingComment(null);
      return;
    }
    setEditingComment(comment);
    onCloseReply();
  };

  const handleDeleteComment = () => {
    setShowDropdown(false);
    onDelete(comment.id);
    // If the comment list has only one element, it means it's the last comment
    // So we need to close the parent comment after deleting the comment
    if (commentList.length === 1) {
      setOpenParentIds((prev) =>
        prev.filter((id) => id !== (level === 0 ? comment.id : rootId))
      );
    }
  };

  const handleCancel = () => {
    onCloseReply();
    setEditingComment(null);
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

  const renderContent = () => {
    const content = comment.content;

    if (!hasToxicSpans)
      return (
        <>
          {renderMention()}
          {comment.content}
        </>
      );

    const result: ReactNode[] = [];
    let lastIndex = 0;

    toxicSpans.forEach((span, index) => {
      const start = Math.min(Math.max(span.start, lastIndex), content.length);
      const end = Math.min(Math.max(span.end, start), content.length);

      if (start > lastIndex) {
        result.push(content.slice(lastIndex, start));
      }

      if (start === end) {
        lastIndex = start;
        return;
      }

      result.push(
        <span
          className={cn({ 'blur-xs select-none': !isVisible })}
          key={`${start}-${end}-${index}`}
        >
          {content.slice(start, end)}
        </span>
      );

      lastIndex = end;
    });

    result.push(content.slice(lastIndex));

    return (
      <>
        {renderMention()}
        {result}
      </>
    );
  };

  const handleViewReplies = (parentId: string) => {
    setOpenParentIds((prev) => [...prev, parentId]);
  };

  const handleViewContent = () => {
    setIsVisible((prev) => !prev);
    setShowDropdown(false);
  };

  const handleHideReplies = (parentId: string) => {
    setOpenParentIds((prev) => prev.filter((value) => value !== parentId));
  };

  const handleVote = (id: string, type: number) => {
    onVote(id, type, async () => {
      if (comment.parent)
        invalidateQueries([
          `${queryKeys.COMMENT_REPLIES_LIST}-${comment.parent?.id}`
        ]);
      else
        invalidateQueries([
          queryKeys.COMMENT_LIST,
          { movieId: comment.movieId }
        ]);
    });
  };

  useEffect(() => {
    if (targetCommentId !== comment.id) return; // only scroll if this comment is the target

    let clearHighlightTimeout: NodeJS.Timeout | null = null;

    // delay scrolling to ensure the target element is rendered and in place
    const scrollTimeout = setTimeout(() => {
      scroller.scrollTo(scrollTargetName, {
        duration: 500,
        smooth: 'easeInOutQuart',
        offset: -250
      });

      setIsScrollTarget(true);
      clearHighlightTimeout = setTimeout(() => {
        setIsScrollTarget(false);
        clearScrollTarget();
      }, HIGHLIGHT_DURATION);
    }, SCROLL_DELAY);

    return () => {
      setIsScrollTarget(false); // Clear highlight if component unmounts or targetCommentId changes

      clearTimeout(scrollTimeout);
      if (clearHighlightTimeout) {
        clearTimeout(clearHighlightTimeout);
      }
    };
  }, [clearScrollTarget, comment.id, scrollTargetName, targetCommentId]);

  useEffect(() => {
    if (!targetCommentId || !targetParentId) return; // only load more if there is a target comment and parent

    if (targetParentId !== comment.id) return; // only load more if this comment is the parent of the target comment

    if (targetCommentId === comment.id) return; // if the target comment is this comment, it means it's already loaded, no need to load more

    if (!isActiveParent || isLoading || isLoadingMore || !hasMore) return; // only load more if this comment is the active parent and not already loading or fetching more

    if (commentList.some((item) => item.id === targetCommentId)) return; // if the target comment is already in the currently loaded comments, no need to load more

    handleLoadMore();
  }, [
    comment.id,
    commentList,
    handleLoadMore,
    hasMore,
    isActiveParent,
    isLoadingMore,
    isLoading,
    targetCommentId,
    targetParentId
  ]);

  const handleOpenReportModal = () => {
    setShowDropdown(false);
    onOpenReportModal(comment.id);
  };

  return (
    <Element name={scrollTargetName}>
      <div
        className={cn(
          'max-640:gap-3 max-520:gap-2.5 max-480:gap-2 relative flex justify-start gap-4',
          {
            'bg-charade rounded-lg transition-colors duration-200 ease-linear':
              isScrollTarget
          }
        )}
      >
        <div className='flex flex-col items-center gap-y-0.5'>
          <AvatarField
            src={renderImageUrl(author.avatarPath)}
            size={level > 0 ? 32 : 45}
            alt={author.fullName}
            breakpoints={[{ breakpoint: 640, size: level > 0 ? 38 : 50 }]}
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
            isBlurWholeContent={isBlurWholeContent}
            renderContent={renderContent}
          />

          <CommentAction
            comment={comment}
            level={level}
            isHidden={isHidden}
            canReply={canCreate}
            canEdit={canUpdate && isAuthor}
            canDelete={canDelete && isAuthor}
            canVote={canVote}
            canViewHiddenContent={canViewHiddenContent}
            canReport={canReport && !isAuthor && !isAdmin}
            isVisible={isVisible}
            showDropdown={showDropdown}
            voteMap={voteMap}
            dropdownRef={dropdownRef}
            onVote={handleVote}
            onReply={handleReplyComment}
            onEdit={() => handleEditComment(comment)}
            onToggleDropdown={handleDropdownToggle}
            onViewContent={handleViewContent}
            onDelete={handleDeleteComment}
            onOpenReportModal={handleOpenReportModal}
          />

          <CommentReplyForm
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
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasMoreComments={!!hasMore}
            onViewReplies={() => handleViewReplies(comment.id)}
            onHideReplies={() => handleHideReplies(comment.id)}
            onLoadMore={handleLoadMore}
            renderChildren={renderChildren}
          />
        </div>
      </div>
    </Element>
  );
}

CommentItem.Skeleton = function () {
  return (
    <div className='max-640:gap-3 max-520:gap-2.5 max-480:gap-2 relative flex justify-start gap-4'>
      <div className='flex shrink-0 flex-col items-center gap-y-0.5'>
        <Skeleton className='skeleton size-11.25 rounded-full! sm:size-12.5' />
      </div>
      <div className='grow'>
        {/* Header */}
        <div className='flex h-6.5 items-center gap-2 sm:h-7.5'>
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
  );
};
