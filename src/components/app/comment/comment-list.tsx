'use client';

import { NoData } from '@/components/no-data';
import { CommentItem } from './comment-item';
import { CommentResType, MovieResType } from '@/types';
import { emptyDiscussion } from '@/assets';
import { useAuth, useValidatePermission } from '@/hooks';
import {
  useDeleteCommentMutation,
  useVoteCommentListQuery,
  useVoteCommentMutation
} from '@/queries';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { logger } from '@/logger';
import { buildLoginRedirectPath, invalidateQueries, notify } from '@/utils';
import { apiConfig, queryKeys, REACTION_TYPE_LIKE } from '@/constants';
import { useCommentStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import Link from 'next/link';
import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
import CommentReportModal from './comment-report-modal';

type CommentListProps = {
  movie: MovieResType;
  commentList: CommentResType[];
  hasMore?: boolean;
  remainingCount?: number;
  isLoadingMore?: boolean;
  animationKey?: string;
  onLoadMore?: () => void;
};

export function CommentList({
  movie,
  commentList,
  hasMore = false,
  remainingCount = 0,
  isLoadingMore = false,
  animationKey,
  onLoadMore
}: CommentListProps) {
  const { profile, isAuthenticated } = useAuth();
  const hasPermission = useValidatePermission();
  const [selectedReportCommentId, setSelectedReportCommentId] = useState<
    string | null
  >(null);

  const commentCount = commentList.length;

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

  const { mutate: deleteComment } = useDeleteCommentMutation();

  const { mutate: voteComment, isPending } = useVoteCommentMutation();

  const { data: voteCommentList = [] } = useVoteCommentListQuery({
    movieId: movie.id,
    enabled: isAuthenticated && !!movie.id
  });

  const canReport =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.userReport.create.permissionCode]
    });

  const canCreate =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.comment.create.permissionCode]
    });

  const canUpdate =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.comment.update.permissionCode]
    });

  const canDelete =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.comment.delete.permissionCode]
    });

  const canVote =
    isAuthenticated &&
    !isPending &&
    hasPermission({
      requiredPermissions: [apiConfig.comment.vote.permissionCode]
    });

  const voteMap: Record<string, number> = {};
  voteCommentList.forEach((vote) => {
    if (vote.id) {
      voteMap[vote.id] = vote.type;
    }
  });

  const handleDeleteComment = (comment: CommentResType) => {
    deleteComment(comment.id, {
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

  const handleVote = (id: string, type: number, onSuccess?: () => void) => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={buildLoginRedirectPath()}
          >
            đăng nhập
          </Link>
          &nbsp;để {type === REACTION_TYPE_LIKE ? 'thích' : 'không thích'} bình
          luận này
        </span>
      );
      return;
    }

    if (isPending) return;

    voteComment(
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

  const handleOpenReportModal = (commentId: string) => {
    setSelectedReportCommentId(commentId);
  };

  const handleCloseReportModal = () => {
    setSelectedReportCommentId(null);
  };

  useEffect(() => {
    if (!targetParentId) return;

    setOpenParentIds((prev) =>
      prev.includes(targetParentId) ? prev : [...prev, targetParentId]
    );
  }, [setOpenParentIds, targetParentId]);

  useEffect(() => {
    if (!targetRootId || isLoadingMore || !hasMore) return;

    if (commentList.some((comment) => comment.id === targetRootId)) return;

    onLoadMore?.();
  }, [commentList, hasMore, isLoadingMore, onLoadMore, targetRootId]);

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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
            delay: Math.min(index * 0.03, 0.3)
          }}
        >
          <CommentItem
            comment={comment}
            editingComment={editingComment}
            level={level}
            openParentIds={openParentIds}
            replyingComment={replyingComment}
            targetCommentId={targetCommentId}
            targetParentId={targetParentId}
            rootId={rootId ?? comment.id}
            userId={profile?.id || ''}
            voteMap={voteMap}
            canCreate={canCreate}
            canUpdate={canUpdate}
            canDelete={canDelete}
            canReport={canReport}
            canVote={canVote}
            onCloseReply={closeReply}
            onDelete={() => handleDeleteComment(comment)}
            onOpenReportModal={handleOpenReportModal}
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

  if (!commentCount)
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
    <>
      <div className='flex flex-col justify-between gap-4'>
        <div className='flex flex-col gap-4' key={animationKey}>
          {renderChildren(commentList, 0)}
        </div>
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
      {canReport && (
        <CommentReportModal
          open={!!selectedReportCommentId}
          onClose={handleCloseReportModal}
          commentId={selectedReportCommentId ?? ''}
        />
      )}
    </>
  );
}
