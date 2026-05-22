'use client';

import { NoData } from '@/components/no-data';
import { CommentItem } from './comment-item';
import { CommentResType, MovieResType } from '@/types';
import { emptyDiscussion } from '@/assets';
import { useAuth } from '@/hooks';
import {
  useDeleteCommentMutation,
  useVoteCommentListQuery,
  useVoteCommentMutation
} from '@/queries';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { logger } from '@/logger';
import { invalidateQueries, notify } from '@/utils';
import { queryKeys, REACTION_TYPE_LIKE } from '@/constants';
import { route } from '@/routes';
import { useCommentStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import Link from 'next/link';
import { m } from 'framer-motion';
import { useEffect } from 'react';

const COMMENT_SKELETON_COUNT = 3;

type CommentListProps = {
  movie: MovieResType;
  commentList: CommentResType[];
  isLoading?: boolean;
  hasMore?: boolean;
  remainingCount?: number;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
};

export function CommentList({
  movie,
  commentList,
  isLoading = false,
  hasMore = false,
  remainingCount = 0,
  isLoadingMore = false,
  onLoadMore
}: CommentListProps) {
  const { profile, isAuthenticated } = useAuth();

  const {
    openParentIds,
    replyingComment,
    editingComment,
    targetCommentId,
    targetParentId,
    setOpenParentIds,
    openReply,
    closeReply,
    setEditingComment,
    clearScrollTarget
  } = useCommentStore(
    useShallow((s) => ({
      openParentIds: s.openParentIds,
      replyingComment: s.replyingComment,
      editingComment: s.editingComment,
      targetCommentId: s.targetCommentId,
      targetParentId: s.targetParentId,
      setOpenParentIds: s.setOpenParentIds,
      openReply: s.openReply,
      closeReply: s.closeReply,
      setEditingComment: s.setEditingComment,
      clearScrollTarget: s.clearScrollTarget
    }))
  );

  const targetRootId = targetParentId || targetCommentId;

  const { mutateAsync: deleteCommentMutate } = useDeleteCommentMutation();

  const { mutateAsync: voteCommentMutate, isPending: voteCommentLoading } =
    useVoteCommentMutation();

  const { data: voteCommentList = [] } = useVoteCommentListQuery({
    movieId: movie.id,
    enabled: isAuthenticated && !!movie.id
  });

  const voteMap: Record<string, number> = {};
  voteCommentList.forEach((vote) => {
    if (vote.id) {
      voteMap[vote.id] = vote.type;
    }
  });

  const handleDeleteComment = async (comment: CommentResType) => {
    await deleteCommentMutate(comment.id, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Xóa bình luận thành công');

          invalidateQueries(
            [queryKeys.COMMENT_LIST, { movieId: comment.movieId }],
            [queryKeys.MOVIE, movie.id]
          );

          if (comment.parent) {
            invalidateQueries([
              `${queryKeys.COMMENT_REPLIES_LIST}-${comment.parent.id}`
            ]);
          }
        } else {
          notify.error('Xóa bình luận thất bại');
        }
      },
      onError: (error) => {
        logger.error('[DELETE_COMMENT_ERROR]', error);
        notify.error('Xóa bình luận thất bại');
      }
    });
  };

  const handleVote = async (
    id: string,
    type: number,
    onSuccess?: () => void
  ) => {
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
          &nbsp;để {type === REACTION_TYPE_LIKE ? 'thích' : 'không thích'} bình
          luận này
        </span>
      );
      return;
    }

    if (voteCommentLoading) return;

    await voteCommentMutate(
      { id, type },
      {
        onSuccess: (res) => {
          if (res.result) {
            invalidateQueries(
              [queryKeys.COMMENT_LIST, { movieId: movie.id }],
              [queryKeys.COMMENT_VOTE_LIST, movie.id]
            );

            const previousVoteType = voteMap[id];
            const isRemovingVote = previousVoteType === type;

            if (isRemovingVote) {
              notify.success(
                `${type === REACTION_TYPE_LIKE ? 'Bỏ thích' : 'Bỏ không thích'} bình luận thành công`
              );
            } else {
              notify.success(
                `${type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} bình luận thành công`
              );
            }

            if (onSuccess) onSuccess();
          } else {
            notify.error(
              `${type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} bình luận thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error(
            `[${type === REACTION_TYPE_LIKE ? 'LIKE' : 'DISLIKE'}_COMMENT_ERROR]`,
            error
          );

          notify.error(
            `${type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} bình luận thất bại`
          );
        }
      }
    );
  };

  useEffect(() => {
    if (!targetParentId) return;

    setOpenParentIds((prev) =>
      prev.includes(targetParentId) ? prev : [...prev, targetParentId]
    );
  }, [setOpenParentIds, targetParentId]);

  useEffect(() => {
    if (!targetRootId || isLoading || isLoadingMore || !hasMore) return;

    if (commentList.some((comment) => comment.id === targetRootId)) return;

    onLoadMore?.();
  }, [
    commentList,
    hasMore,
    isLoadingMore,
    isLoading,
    onLoadMore,
    targetRootId
  ]);

  const renderChildren = (
    commentList: CommentResType[],
    level: number,
    rootId?: string
  ) => {
    return commentList
      .filter((comment) => comment?.id)
      .map((comment, index) => (
        <m.div
          key={comment.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            ease: 'linear',
            delay: index * 0.05
          }}
        >
          <CommentItem
            comment={comment}
            editingComment={editingComment}
            isAuthenticated={isAuthenticated}
            isVoteLoading={voteCommentLoading}
            level={level}
            openParentIds={openParentIds}
            replyingComment={replyingComment}
            targetCommentId={targetCommentId}
            targetParentId={targetParentId}
            rootId={rootId ?? comment.id}
            userId={profile?.id || ''}
            voteMap={voteMap}
            onCloseReply={closeReply}
            onDelete={() => handleDeleteComment(comment)}
            onVote={handleVote}
            openReply={openReply}
            renderChildren={renderChildren}
            setEditingComment={setEditingComment}
            setOpenParentIds={setOpenParentIds}
            clearScrollTarget={clearScrollTarget}
          />
        </m.div>
      ));
  };

  if (isLoading)
    return (
      <div className='mt-12 flex flex-col justify-between gap-6'>
        {Array.from({ length: COMMENT_SKELETON_COUNT }).map((_, index) => (
          <CommentItem.Skeleton key={`comment-skeleton-${index}`} />
        ))}
      </div>
    );

  if (!commentList.length)
    return (
      <NoData
        className='bg-background/30 max-640:text-[13px] max-520:text-xs mt-4 min-h-40 rounded-lg px-8 py-12 opacity-50'
        imageClassName='max-640:size-10'
        content={
          <>
            Chưa có bình luận nào
            <br />
            Hãy trở thành người đầu tiên bình luận 😊
          </>
        }
        size={50}
        src={emptyDiscussion.src}
      />
    );

  return (
    <div className='max-640:mt-6 max-520:mt-4 mt-8 flex flex-col justify-between gap-4'>
      {renderChildren(commentList, 0)}
      {hasMore && (
        <div className='flex justify-center'>
          {isLoadingMore ? (
            <VerticalBarLoading className='py-10' />
          ) : (
            <Button
              className='hover:text-golden-glow hover:bg-transparent'
              variant='ghost'
              onClick={onLoadMore}
            >
              {remainingCount > 0 && `Xem thêm ${remainingCount} bình luận`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
