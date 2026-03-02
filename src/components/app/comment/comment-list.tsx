'use client';

import { NoData } from '@/components/no-data';
import CommentItem from './comment-item';
import {
  ApiResponse,
  CommentResType,
  CommentVoteResType,
  MovieResType
} from '@/types';
import { emptyDiscussion } from '@/assets';
import { useAuth } from '@/hooks';
import {
  useDeleteCommentMutation,
  useVoteCommentListQuery,
  useVoteCommentMutation
} from '@/queries';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { getQueryClient } from '@/components/providers';
import { logger } from '@/logger';
import { notify } from '@/utils';
import { queryKeys, REACTION_TYPE_LIKE } from '@/constants';
import { route } from '@/routes';
import { useCommentStore, useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import CommentItemSkeleton from './comment-item-skeleton';
import Link from 'next/link';

export default function CommentList({
  commentList,
  isLoading = false,
  hasMore = false,
  remainingCount = 0,
  isLoadMoreLoading = false,
  onLoadMore
}: {
  commentList: CommentResType[];
  isLoading?: boolean;
  hasMore?: boolean;
  remainingCount?: number;
  isLoadMoreLoading?: boolean;
  onLoadMore?: () => void;
}) {
  const { profile, isAuthenticated } = useAuth();
  const queryClient = getQueryClient();

  const { movie, setMovie } = useMovieStore(
    useShallow((s) => ({ movie: s.movie, setMovie: s.setMovie }))
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

  const { mutateAsync: deleteCommentMutate } = useDeleteCommentMutation();
  const { mutateAsync: voteCommentMutate, isPending: voteCommentLoading } =
    useVoteCommentMutation();
  const { data: voteCommentListData } = useVoteCommentListQuery({
    movieId: movie?.id || '',
    enabled: isAuthenticated && !!movie?.id
  });

  const voteCommentList: CommentVoteResType[] = voteCommentListData?.data || [];

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
          notify.success('Xoá bình luận thành công');

          // Invalidate comment list and movie data for updating total comments
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [queryKeys.COMMENT_LIST]
            }),
            queryClient.invalidateQueries({
              queryKey: [queryKeys.MOVIE, movie?.id]
            })
          ]);

          // Invalidate replies list if comment is a reply
          if (comment.parent) {
            await queryClient.invalidateQueries({
              queryKey: [
                `${queryKeys.COMMENT_LIST}-replies-${comment.parent.id}`
              ]
            });
          }

          // Update movie store data
          const newMovieData = queryClient.getQueryData<
            ApiResponse<MovieResType>
          >([queryKeys.MOVIE, movie?.id]);
          const newMovie = newMovieData?.data;
          setMovie(newMovie);
        } else {
          notify.error('Xoá bình luận thất bại');
        }
      },
      onError: (error) => {
        logger.error('Error while deleting comment', error);
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
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
        onSuccess: async (res) => {
          if (res.result) {
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [queryKeys.COMMENT_VOTE_LIST, movie?.id]
              })
            ]);
            if (onSuccess) onSuccess();
          } else {
            notify.error(
              `${type === REACTION_TYPE_LIKE ? 'Thích' : 'Không thích'} bình luận thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error('Error while liking comment', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  const renderChildren = (
    commentList: CommentResType[],
    level: number,
    rootId?: string
  ) => {
    return commentList
      .filter((comment) => comment?.id)
      .map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          editingComment={editingComment}
          isAuthenticated={isAuthenticated}
          isVoteLoading={voteCommentLoading}
          level={level}
          openParentIds={openParentIds}
          replyingComment={replyingComment}
          rootId={rootId ?? comment.id}
          userId={profile?.id || ''}
          voteMap={voteMap}
          closeReply={closeReply}
          onDelete={() => handleDeleteComment(comment)}
          onVote={handleVote}
          openReply={openReply}
          renderChildren={renderChildren}
          setEditingComment={setEditingComment}
          setOpenParentIds={setOpenParentIds}
        />
      ));
  };

  if (isLoading)
    return (
      <div className='mt-12 flex flex-col justify-between gap-6'>
        {Array.from({ length: 3 }).map((_, index) => (
          <CommentItemSkeleton key={`comment-skeleton-${index}`} />
        ))}
      </div>
    );

  if (!commentList.length)
    return (
      <NoData
        className='bg-background/30 mt-4 min-h-40 rounded-lg px-8 py-12 opacity-50'
        content='Chưa có bình luận nào'
        size={50}
        src={emptyDiscussion.src}
      />
    );

  return (
    <div className='mt-4 flex flex-col justify-between gap-2'>
      {renderChildren(commentList, 0)}
      {hasMore && (
        <div className='flex justify-center'>
          <Button
            className='dark:hover:text-golden-glow min-w-45 text-sm dark:hover:bg-transparent'
            variant='ghost'
            onClick={onLoadMore}
          >
            {isLoadMoreLoading ? (
              <VerticalBarLoading />
            ) : (
              remainingCount > 0 && `Xem thêm ${remainingCount} bình luận`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
