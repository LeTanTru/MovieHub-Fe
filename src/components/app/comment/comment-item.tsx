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
  REACTION_TYPE_LIKE,
  STATUS_HIDE
} from '@/constants';
import { useClickOutside, useScrollLoadMore } from '@/hooks';
import { cn } from '@/lib';
import { AuthorInfoType, CommentResType, CommentSearchType } from '@/types';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaEllipsis,
  FaEye,
  FaEyeSlash,
  FaReply,
  FaTrash
} from 'react-icons/fa6';
import { Activity } from '@/components/activity';
import { AiOutlineEdit } from 'react-icons/ai';
import { commentApiRequest } from '@/api-requests';
import CommentForm from './comment-form';
import { VerticalBarLoading } from '@/components/loading';
import { getQueryClient } from '@/components/providers';
import { Pin } from 'lucide-react';

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
  closeReply,
  onDelete,
  onVote,
  openReply,
  renderChildren,
  setEditingComment,
  setOpenParentIds
}: {
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
  closeReply: () => void;
  onDelete: (id: string) => void;
  onVote: (id: string, type: number, onSuccess?: () => void) => void;
  openReply: (replyingComment: CommentResType | null) => void;
  renderChildren: (
    list: CommentResType[],
    level: number,
    rootId?: string
  ) => ReactNode;
  setEditingComment: (editingComment: CommentResType | null) => void;
  setOpenParentIds: (ids: string[] | ((prev: string[]) => string[])) => void;
}) {
  const authorInfo = JSON.parse(comment.authorInfo || '{}') as AuthorInfoType;
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
  } = useScrollLoadMore<HTMLDivElement, CommentSearchType, CommentResType>({
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

  const commentListSize = commentList.length;

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

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
        <span className='rounded bg-slate-700 px-1.25 py-0.75 font-medium text-gray-200'>
          {mention}
        </span>
        &nbsp;
      </>
    );
  };

  const handleViewReplies = (parentId: string) => {
    setOpenParentIds((prev) => [...prev, parentId]);
  };

  const handleHideReplies = (parentId: string) => {
    setOpenParentIds((prev) => prev.filter((value) => value !== parentId));
  };

  const handleToggleBlurredContent = () => {
    setShowBlurredContent((prev) => !prev);
    setShowDropdown(false);
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
    <div className='flex-start relative flex gap-4 pt-4'>
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
            <span>
              {authorInfo.fullName}
              <span
                className={cn({
                  'text-golden-glow font-semibold': isAuthor
                })}
              >
                {isAuthor && <>&nbsp;(Bạn)</>}
              </span>
            </span>

            <GenderIcon
              className={cn('size-4', {
                'text-cyan-500': gender === GENDER_MALE,
                'text-pink-500': gender === GENDER_FEMALE,
                'text-golden-glow': gender === GENDER_OTHER
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
              title='Đã chỉnh sửa'
              className='-ml-1.5 text-xs text-gray-400'
            >
              (đã chỉnh sửa)
            </span>
          </Activity>
          {movieItem &&
            (movieItem.parent ? (
              <Badge
                variant='outline'
                className='border px-2 py-1 text-xs font-medium text-gray-400'
                title={`Phần ${movieItem.parent.label} - Tập ${movieItem.label}`}
              >
                P. {movieItem.parent.label} - Tập {movieItem.label}
              </Badge>
            ) : (
              <Badge
                variant='outline'
                className='border px-2 py-1 text-xs font-medium text-gray-400'
                title={`Phần ${movieItem.label}`}
              >
                P. {movieItem.label}
              </Badge>
            ))}
          <Activity visible={comment.isPinned}>
            <span title='Đã ghim' className='ml-auto'>
              <Pin className='text-golden-glow fill-golden-glow size-5 rotate-45' />
            </span>
          </Activity>
        </div>

        <div
          className={cn('relative mt-2 break-all text-white', {
            'cursor-pointer': isHiddenComment && !showBlurredContent
          })}
          onClick={
            isHiddenComment && !showBlurredContent
              ? handleToggleBlurredContent
              : undefined
          }
        >
          <div
            className={cn({
              'blur-xs select-none': isHiddenComment && !showBlurredContent
            })}
          >
            {renderMention()}
            {comment.content}
          </div>
        </div>

        <div className='relative mt-4 flex items-center gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <LikeIcon
                size={16}
                onClick={() => handleVote(comment.id, REACTION_TYPE_LIKE)}
                iconClassName={cn(
                  'transition-colors duration-200 ease-linear',
                  {
                    'hover:text-golden-glow': isAuthenticated && !isVoteLoading,
                    'text-golden-glow':
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
                    'hover:text-red-beauty': isAuthenticated && !isVoteLoading,
                    'text-red-beauty':
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
              className='hover:text-golden-glow flex cursor-pointer items-center gap-2 font-light text-gray-400 transition-all duration-200 ease-linear select-none'
              onClick={handleReplyComment}
            >
              <FaReply />
              <span>Trả lời</span>
            </button>
          </Activity>
          <Activity visible={isAuthor && isAuthenticated}>
            <button
              type='button'
              className='hover:text-golden-glow flex cursor-pointer items-center gap-2 font-light text-gray-400 transition-all duration-200 ease-linear select-none'
              onClick={() => handleEditComment(comment)}
            >
              <AiOutlineEdit />
              <span>Chỉnh sửa</span>
            </button>
          </Activity>
          <div className='relative' ref={dropdownRef}>
            {(isHiddenComment || isAuthor) && (
              <button
                type='button'
                className='hover:text-golden-glow flex cursor-pointer items-center gap-1 font-light text-gray-400 transition-all duration-200 ease-linear select-none'
                onClick={handleDropdownToggle}
              >
                <FaEllipsis /> <span>Thêm</span>
              </button>
            )}

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
                  {isHiddenComment && (
                    <button
                      className='flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                      onClick={handleToggleBlurredContent}
                    >
                      {showBlurredContent ? (
                        <>
                          <FaEyeSlash />
                          Ẩn nội dung
                        </>
                      ) : (
                        <>
                          <FaEye />
                          Xem nội dung
                        </>
                      )}
                    </button>
                  )}
                  {isAuthor && (
                    <button
                      className='flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-red-500'
                      onClick={() => {
                        setShowDropdown(false);
                        onDelete(comment.id);
                      }}
                    >
                      <FaTrash />
                      Xoá bình luận
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {(replyingComment?.id === comment.id ||
            editingComment?.id === comment.id) && (
            <motion.div
              key='comment-form'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1, ease: 'linear' }}
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

        <Activity visible={isActiveParent && commentListSize > 0}>
          {renderChildren(commentList, level + 1, rootId)}
          {commentLoadMoreLoading && <VerticalBarLoading />}
        </Activity>

        <Activity visible={comment.totalChildren > 0}>
          {!isActiveParent ? (
            <button
              className='hover:text-golden-glow mt-4 flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
              onClick={() => handleViewReplies(comment.id)}
            >
              <FaChevronDown /> Xem tất cả&nbsp;{comment.totalChildren} trả lời
            </button>
          ) : commentListLoading ? (
            <VerticalBarLoading />
          ) : (
            <div
              className='mt-4 flex items-center gap-4'
              style={{ marginLeft: level * 40 }}
            >
              {hasMoreComments && (
                <Button
                  variant='ghost'
                  className='hover:text-golden-glow flex h-5! items-center p-0! font-medium hover:bg-transparent!'
                  onClick={() => handleFetchNextPage()}
                >
                  <FaChevronDown /> Xem thêm&nbsp;
                  {comment.totalChildren - commentListSize} trả lời
                </Button>
              )}
              <Button
                variant='ghost'
                className='h-5! p-0! font-medium hover:bg-transparent! hover:text-red-500'
                onClick={() => handleHideReplies(comment.id)}
              >
                <FaChevronUp /> Ẩn trả lời
              </Button>
            </div>
          )}
        </Activity>
      </div>
    </div>
  );
}
