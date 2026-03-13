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
import { useClickOutside, useLoadMore } from '@/hooks';
import { cn } from '@/lib';
import { AuthorInfoType, CommentResType, CommentSearchType } from '@/types';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { AnimatePresence, m } from 'framer-motion';
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
    closeReply();
    await queryClient.invalidateQueries({
      queryKey: [queryKeys.COMMENT_LIST]
    });
    const parentIdToInvalidate = level === 0 ? comment.id : rootId;
    setOpenParentIds((prev) => [...prev, parentIdToInvalidate]);
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
    setShowDropdown(false);
    if (editingComment?.id === comment.id) {
      setEditingComment(null);
      return;
    }
    setEditingComment(comment);
    closeReply();
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
    closeReply();
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

  const showMore = isHiddenComment || isAuthor;

  return (
    <div className='max-640:gap-3 max-520:gap-2.5 max-480:gap-2 relative flex justify-start gap-4'>
      <div className='flex flex-col items-center gap-y-0.5'>
        <AvatarField
          src={renderImageUrl(authorInfo.avatarPath)}
          size={45}
          alt={authorInfo.fullName}
          breakpoints={[{ breakpoint: 640, size: 50 }]}
        />
        {isAuthor && (
          <span className='max-640:block text-golden-glow max-640:text-[13px] max-520:text-xs hidden font-semibold'>
            Bạn
          </span>
        )}
      </div>
      <div className='grow'>
        <div className='max-640:gap-1 max-768:gap-1.5 relative flex items-center justify-start gap-2'>
          <div className='max-640:gap-x-1 flex items-center gap-x-2'>
            {kind && (
              <Badge
                variant='outline'
                className={cn(
                  'max-640:text-xs max-520:text-[10px] max-640:px-1 border text-sm font-medium uppercase',
                  kind.style
                )}
              >
                {kind.label}
              </Badge>
            )}
            <div className='max-640:text-[13px] flex items-center'>
              <span className='max-990:max-w-90 max-800:max-w-80 max-768:max-w-70 max-720:max-w-50 max-640:max-w-45 max-480:max-w-40 max-420:max-w-20 line-clamp-1 block max-w-125 truncate'>
                {authorInfo.fullName}
              </span>
              {isAuthor && (
                <span className='max-640:hidden text-golden-glow font-semibold'>
                  &nbsp;(Bạn)
                </span>
              )}
            </div>

            <GenderIcon
              className={cn('max-640:size-3 size-4', {
                'text-cyan-500': gender === GENDER_MALE,
                'text-pink-500': gender === GENDER_FEMALE,
                'text-golden-glow': gender === GENDER_OTHER
              })}
            />
          </div>
          <span
            title={convertUTCToLocal(comment.createdDate, DATE_TIME_FORMAT)}
            className='max-640:hidden whitespace-nowrap text-gray-400'
          >
            {timeAgo(comment.createdDate)}
          </span>
          {movieItem && movieItem.parent && (
            <Badge
              variant='outline'
              className='max-640:px-1.5 max-640:py-0.5 max-480:text-[10px] border px-2 py-1 text-xs font-medium whitespace-nowrap text-gray-400'
              title={`Phần ${movieItem.parent.label} - Tập ${movieItem.label}`}
            >
              P. {movieItem.parent.label} - T. {movieItem.label}
            </Badge>
          )}
          <Activity visible={comment.createdDate !== comment.modifiedDate}>
            <span
              title={convertUTCToLocal(comment.modifiedDate, DATE_TIME_FORMAT)}
              className='max-640:text-[13px] max-520:text-xs whitespace-nowrap text-gray-400'
            >
              (đã chỉnh sửa)
            </span>
          </Activity>
          <Activity visible={comment.isPinned}>
            <span title='Đã ghim' className='ml-auto'>
              <Pin className='text-golden-glow fill-golden-glow size-5 rotate-45' />
            </span>
          </Activity>
        </div>

        <div
          role='button'
          className={cn(
            'max-640:text-[13px] relative mt-2 break-all text-white',
            {
              'cursor-pointer': isHiddenComment && !showBlurredContent
            }
          )}
          onClick={
            isHiddenComment && !showBlurredContent
              ? handleToggleBlurredContent
              : undefined
          }
        >
          <div
            className={cn({
              'max-640:text-[13px] blur-xs select-none':
                isHiddenComment && !showBlurredContent
            })}
          >
            {renderMention()}
            {comment.content}
          </div>
        </div>
        <div className='max-640:mt-3 relative mt-4 flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span
              title={convertUTCToLocal(comment.createdDate, DATE_TIME_FORMAT)}
              className='max-640:block max-640:min-w-6 max-640:text-[13px] max-520:text-xs hidden text-gray-400'
            >
              {timeAgo(comment.createdDate, true)}
            </span>
            <div className='flex items-center gap-4'>
              <div className='max-640:gap-1.5 flex items-center gap-2'>
                <LikeIcon
                  size={16}
                  onClick={() => handleVote(comment.id, REACTION_TYPE_LIKE)}
                  iconClassName={cn(
                    'transition-colors duration-200 ease-linear',
                    {
                      'hover:text-golden-glow':
                        isAuthenticated && !isVoteLoading,
                      'text-golden-glow':
                        voteMap[comment.id] === REACTION_TYPE_LIKE
                    }
                  )}
                />
                <span
                  className={cn('max-640:hidden', {
                    'max-640:block': voteMap[comment.id] === REACTION_TYPE_LIKE
                  })}
                >
                  {comment.totalLike}
                </span>
              </div>
              <div className='max-640:gap-1.5 flex items-center gap-2'>
                <DislikeIcon
                  size={16}
                  onClick={() => handleVote(comment.id, REACTION_TYPE_DISLIKE)}
                  iconClassName={cn(
                    'transition-colors duration-200 ease-linear',
                    {
                      'hover:text-red-beauty':
                        isAuthenticated && !isVoteLoading,
                      'text-red-beauty':
                        voteMap[comment.id] === REACTION_TYPE_DISLIKE
                    }
                  )}
                />
                <span
                  className={cn('max-640:hidden', {
                    'max-640:block':
                      voteMap[comment.id] === REACTION_TYPE_DISLIKE
                  })}
                >
                  {comment.totalDislike}
                </span>
              </div>
            </div>
          </div>
          <Activity visible={isAuthenticated}>
            <button
              type='button'
              className='hover:text-golden-glow max-640:text-[13px] max-520:text-xs flex cursor-pointer items-center gap-2 text-gray-400 transition-all duration-200 ease-linear select-none'
              onClick={handleReplyComment}
            >
              <FaReply />
              <span>Trả lời</span>
            </button>
          </Activity>
          <Activity visible={isAuthor && isAuthenticated}>
            <button
              type='button'
              className={cn(
                'hover:text-golden-glow max-640:text-[13px] max-520:text-xs max-420:hidden flex cursor-pointer items-center gap-2 text-gray-400 transition-all duration-200 ease-linear select-none',
                {
                  'max-520:hidden': level > 0
                }
              )}
              onClick={() => handleEditComment(comment)}
            >
              <AiOutlineEdit />
              <span>Chỉnh sửa</span>
            </button>
          </Activity>
          <div className='relative' ref={dropdownRef}>
            {showMore && (
              <button
                type='button'
                className='hover:text-golden-glow max-640:text-[13px] max-520:text-xs flex cursor-pointer items-center gap-1 text-gray-400 transition-all duration-200 ease-linear select-none'
                onClick={handleDropdownToggle}
              >
                <FaEllipsis /> <span>Thêm</span>
              </button>
            )}

            <AnimatePresence>
              {showDropdown && (
                <m.div
                  initial={{
                    opacity: 0,
                    scale: 0.8
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
                  className={cn(
                    'max-640:min-w-36 absolute top-5 -left-5 z-10 min-w-40 origin-[10px_-50%] overflow-hidden rounded-lg bg-gray-100 py-1 shadow-lg',
                    {
                      'max-420:-left-12.5 max-420:origin-[40px_-50%] max-480:-left-10 max-480:origin-[40px_-50%]':
                        level === 0,
                      'max-480:-left-7.5 max-480:origin-[30px_-50%] max-420:-left-[70px] max-420:origin-[80px_-50%]':
                        level > 0
                    }
                  )}
                >
                  <Activity visible={isAuthor && isAuthenticated}>
                    <button
                      type='button'
                      className={cn(
                        'max-640:text-[13px] max-520:text-xs w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80',
                        {
                          'max-420:flex hidden': level === 0,
                          '520:hidden flex': level > 0
                        }
                      )}
                      onClick={() => handleEditComment(comment)}
                    >
                      <AiOutlineEdit />
                      <span>Chỉnh sửa</span>
                    </button>
                  </Activity>
                  {isHiddenComment && (
                    <button
                      className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
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
                      className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-red-500'
                      onClick={handleDeleteComment}
                    >
                      <FaTrash />
                      Xoá bình luận
                    </button>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {(replyingComment?.id === comment.id ||
            editingComment?.id === comment.id) && (
            <m.div
              key='comment-form'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1, ease: 'linear' }}
            >
              <CommentForm
                parentId={rootId}
                movieId={comment.movieId}
                mode={editingComment?.id === comment.id ? 'edit' : 'reply'}
                defaultMention={`@${authorInfo.fullName}`}
                onSubmitted={handleReplySubmit}
                onCancel={handleCancel}
              />
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {isActiveParent && commentList.length > 0 && (
            <m.div
              key='replies-container'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1, ease: 'linear' }}
              style={{ overflow: 'hidden' }}
            >
              <div className='mt-4 flex flex-col gap-4'>
                {renderChildren(commentList, level + 1, rootId)}
              </div>
              {commentLoadMoreLoading && (
                <VerticalBarLoading className='py-10' />
              )}
            </m.div>
          )}
        </AnimatePresence>

        <Activity visible={comment.totalChildren > 0}>
          {!isActiveParent ? (
            <button
              className='hover:text-golden-glow max-640:text-[13px] max-520:text-xs mt-4 flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
              onClick={() => handleViewReplies(comment.id)}
            >
              <FaChevronDown /> Xem tất cả&nbsp;{comment.totalChildren} trả lời
            </button>
          ) : commentListLoading ? (
            <VerticalBarLoading className='py-10' />
          ) : (
            <div
              className='max-640:mt-2 mt-4 flex items-center gap-4'
              style={{ marginLeft: level * 40 }}
            >
              {hasMoreComments && (
                <Button
                  variant='ghost'
                  className='dark:hover:text-golden-glow max-640:text-[13px] max-520:text-xs flex h-5! items-center p-0! font-medium dark:hover:bg-transparent'
                  onClick={() => handleFetchNextPage()}
                >
                  <FaChevronDown /> Xem thêm&nbsp;
                  {comment.totalChildren - commentList.length} trả lời
                </Button>
              )}
              <Button
                variant='ghost'
                className='max-640:text-[13px] max-520:text-xs flex h-5! items-center p-0! font-medium dark:hover:bg-transparent dark:hover:text-red-500'
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
