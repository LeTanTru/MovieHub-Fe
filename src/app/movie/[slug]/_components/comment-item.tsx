'use client';

import { DislikeIcon, LikeIcon } from '@/assets';
import { AvatarField, Button } from '@/components/form';
import { Badge } from '@/components/ui/badge';
import {
  DATE_TIME_FORMAT,
  DEFAULT_PAGE_SIZE,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  genderIconMaps,
  kindMaps,
  queryKeys,
  REACTION_TYPE_DISLIKE,
  REACTION_TYPE_LIKE
} from '@/constants';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { AuthorInfoType, CommentResType } from '@/types';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { FaEllipsis, FaReply, FaTrash } from 'react-icons/fa6';
import { Activity } from '@/components/activity';
import { AiOutlineEdit } from 'react-icons/ai';
import { useInfiniteCommentListQuery } from '@/queries';
import { useCommentStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import CommentForm from './comment-form';
import { DotLoading } from '@/components/loading';
import { getQueryClient } from '@/components/providers';

export default function CommentItem({
  comment,
  level,
  voteMap,
  rootId,
  isAuthenticated,
  isVoteLoading,
  userId,
  onDelete,
  onVote,
  renderChildren
}: {
  comment: CommentResType & { children?: CommentResType[] };
  isAuthenticated: boolean;
  isVoteLoading: boolean;
  level: number;
  rootId: string;
  userId: string;
  voteMap: Record<string, number>;
  onDelete: (id: string) => void;
  onVote: (id: string, type: number, onSuccess?: () => void) => void;
  renderChildren: (
    list: CommentResType[],
    level: number,
    rootId?: string
  ) => ReactNode;
}) {
  const authorInfo = useMemo(
    () => JSON.parse(comment.authorInfo || '{}') as AuthorInfoType,
    [comment.authorInfo]
  );
  const isAuthor = userId && authorInfo.id ? userId === authorInfo.id : false;
  const kind =
    authorInfo.kind !== undefined ? kindMaps[authorInfo.kind] : undefined;
  const replyToInfo = comment.replyToInfo
    ? (JSON.parse(comment.replyToInfo) as AuthorInfoType)
    : null;

  const gender = authorInfo.gender || GENDER_OTHER;
  const GenderIcon = genderIconMaps[gender];

  const movieItem = comment.movieItem;

  const queryClient = getQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const {
    openParentIds,
    replyingComment,
    editingComment,
    setOpenParentIds,
    openReply,
    closeReply,
    setEditingComment
  } = useCommentStore(
    useShallow((s) => ({
      openParentIds: s.openParentIds,
      replyingComment: s.replyingComment,
      editingComment: s.editingComment,
      setOpenParentIds: s.setOpenParentIds,
      openReply: s.openReply,
      closeReply: s.closeReply,
      setEditingComment: s.setEditingComment
    }))
  );
  const isActiveParent = openParentIds.includes(comment.id);

  const {
    data: commentListData,
    isLoading: commentListLoading,
    hasNextPage: hasMoreComments,
    fetchNextPage: fetchMoreComments,
    isFetchingNextPage: commentLoadMoreLoading
  } = useInfiniteCommentListQuery({
    params: {
      movieId: comment.movieId,
      parentId: comment.id,
      size: DEFAULT_PAGE_SIZE
    },
    queryKey: `${queryKeys.COMMENT_LIST}-replies-${comment.id}`,
    enabled: isActiveParent
  });

  const commentList = useMemo(
    () =>
      commentListData?.pages?.flatMap(
        (pageData) => pageData.data.content || []
      ) || [],
    [commentListData?.pages]
  );

  const commentListSize = commentList.length;

  const handleDropdownToggle = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  const handleReplySubmit = async () => {
    closeReply();
    await queryClient.invalidateQueries({
      queryKey: [queryKeys.COMMENT_LIST]
    });
    const parentIdToInvalidate = level === 0 ? comment.id : rootId;

    await queryClient.invalidateQueries({
      queryKey: [`${queryKeys.COMMENT_LIST}-replies-${parentIdToInvalidate}`]
    });
  };

  const handleReplyComment = () => {
    if (replyingComment?.id === comment.id) {
      closeReply();
    } else {
      openReply(comment);
    }
    setEditingComment(null);
  };

  const handleEditComment = (comment: CommentResType) => {
    if (editingComment?.id === comment.id) {
      setEditingComment(null);
      return;
    }
    setEditingComment(comment);
    closeReply();
  };

  const handleCancelReply = () => {
    closeReply();
    setEditingComment(null);
  };

  const renderMention = () => {
    if (!replyToInfo?.fullName) return;

    const mention = `@${replyToInfo?.fullName}`;

    return (
      <>
        <span className='bg-light-golden-yellow rounded px-1.5 py-0.5 font-semibold text-black'>
          {mention}
        </span>
        &nbsp;
      </>
    );
  };

  const handleViewReplies = (parentId: string) => {
    setOpenParentIds((prev) => [...prev, parentId]);
  };

  const handleFetchNextPage = () => {
    fetchMoreComments();
  };

  const handleHideReplies = (parentId: string) => {
    setOpenParentIds((prev) => prev.filter((value) => value !== parentId));
  };

  const handleVote = (id: string, type: number) => {
    onVote(id, type, async () => {
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

  return (
    <div className='flex-start relative flex gap-2.5 pt-4'>
      <AvatarField
        src={renderImageUrl(authorInfo.avatarPath)}
        size={50}
        alt={authorInfo.fullName}
      />
      <div className='grow'>
        <div className='flex-start relative flex items-center gap-2'>
          <div className='flex items-center gap-x-2'>
            {kind && (
              <Badge
                variant='outline'
                className={cn('border text-sm font-medium', kind.style)}
              >
                {kind.label}
              </Badge>
            )}
            <span>{authorInfo.fullName}</span>
            <span
              className={cn({
                'text-light-golden-yellow font-semibold': isAuthor
              })}
            >
              {isAuthor && '(Bạn)'}
            </span>
            <GenderIcon
              className={cn('size-4', {
                'text-cyan-500': gender === GENDER_MALE,
                'text-pink-500': gender === GENDER_FEMALE,
                'text-light-golden-yellow': gender === GENDER_OTHER
              })}
            />
          </div>
          <span
            title={convertUTCToLocal(comment.createdDate, DATE_TIME_FORMAT)}
            className='text-xs text-gray-400'
          >
            {timeAgo(comment.createdDate)}
          </span>
          <Activity visible={comment.createdDate !== comment.modifiedDate}>
            <span
              title={convertUTCToLocal(comment.modifiedDate, DATE_TIME_FORMAT)}
              className='-ml-1.5 text-xs text-gray-400'
            >
              (đã chỉnh sửa)
            </span>
          </Activity>
          {movieItem && (
            <Badge
              variant='outline'
              className='border px-2 py-1 text-xs font-medium text-gray-400'
            >
              P. {movieItem.parent.label} - Tập {movieItem.label}
            </Badge>
          )}
        </div>
        <div className='mt-2 break-all text-gray-400'>
          {renderMention()}
          {comment.content}
        </div>
        <div className='relative mt-2 flex items-center gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <LikeIcon
                size={16}
                onClick={() => handleVote(comment.id, REACTION_TYPE_LIKE)}
                iconClassName={cn(
                  'transition-colors duration-200 ease-linear',
                  {
                    'hover:text-light-golden-yellow':
                      isAuthenticated && !isVoteLoading,
                    'text-light-golden-yellow':
                      voteMap[comment.id] === REACTION_TYPE_LIKE
                  }
                )}
              />
              {comment.totalLike}
            </div>
            <div className='flex items-center gap-2'>
              <DislikeIcon
                size={16}
                onClick={() => handleVote(comment.id, REACTION_TYPE_DISLIKE)}
                iconClassName={cn(
                  'transition-colors duration-200 ease-linear',
                  {
                    'hover:text-dislike-comment':
                      isAuthenticated && !isVoteLoading,
                    'text-dislike-comment':
                      voteMap[comment.id] === REACTION_TYPE_DISLIKE
                  }
                )}
              />
              {comment.totalDislike}
            </div>
          </div>
          <Activity visible={isAuthenticated}>
            <button
              type='button'
              className='flex items-center gap-2 font-light opacity-50 transition-opacity duration-200 ease-linear select-none hover:opacity-100'
              onClick={handleReplyComment}
            >
              <FaReply />
              <span>Trả lời</span>
            </button>
          </Activity>
          <Activity visible={isAuthor && isAuthenticated}>
            <button
              type='button'
              className='flex items-center gap-2 font-light opacity-50 transition-opacity duration-200 ease-linear select-none hover:opacity-100'
              onClick={() => handleEditComment(comment)}
            >
              <AiOutlineEdit />
              <span>Chỉnh sửa</span>
            </button>
          </Activity>
          <Activity visible={isAuthor && isAuthenticated}>
            <div className='relative' ref={dropdownRef}>
              <button
                type='button'
                className='flex items-center gap-1 font-light opacity-50 transition-opacity duration-200 ease-linear select-none hover:opacity-100'
                onClick={handleDropdownToggle}
              >
                <FaEllipsis /> <span>Thêm</span>
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                      transformOrigin: '0% -50%'
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8
                    }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                    className='absolute top-5 z-10 min-w-40 overflow-hidden rounded-lg bg-gray-100 py-2 shadow-lg'
                  >
                    <button
                      className='flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                      onClick={() => {
                        setShowDropdown(false);
                        onDelete(comment.id);
                      }}
                    >
                      <FaTrash />
                      Xoá bình luận
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Activity>
        </div>
        {isActiveParent && commentListSize > 0 && (
          <>
            {renderChildren(commentList, level + 1, rootId)}
            {commentLoadMoreLoading && (
              <DotLoading className='mt-4 justify-start bg-transparent' />
            )}
          </>
        )}

        <Activity visible={comment.totalChildren > 0}>
          <>
            {!isActiveParent ? (
              <button
                className='hover:text-light-golden-yellow mt-2 transition-colors duration-200 ease-linear'
                onClick={() => handleViewReplies(comment.id)}
              >
                Xem tất cả ({comment.totalChildren}) trả lời
              </button>
            ) : commentListLoading ? (
              <DotLoading className='mt-4 justify-start bg-transparent' />
            ) : (
              <div
                className='mt-4 flex items-center gap-x-4'
                style={{ marginLeft: level * 40 }}
              >
                {hasMoreComments && (
                  <Button
                    variant='ghost'
                    className='h-5! p-0! font-medium hover:opacity-70'
                    onClick={() => handleFetchNextPage()}
                  >
                    Xem thêm ({comment.totalChildren - commentListSize})
                  </Button>
                )}

                <Button
                  variant='ghost'
                  className='h-5! p-0! font-medium text-red-500 hover:opacity-70'
                  onClick={() => handleHideReplies(comment.id)}
                >
                  Ẩn trả lời
                </Button>
              </div>
            )}
          </>
        </Activity>
        <AnimatePresence initial={false}>
          {(replyingComment?.id === comment.id ||
            editingComment?.id === comment.id) && (
            <motion.div
              key='comment-form'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15, ease: 'linear' }}
            >
              <CommentForm
                parentId={rootId.toString()}
                movieId={comment.movieId.toString()}
                defaultMention={`@${authorInfo.fullName}`}
                onSubmitted={handleReplySubmit}
                onCancel={handleCancelReply}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
