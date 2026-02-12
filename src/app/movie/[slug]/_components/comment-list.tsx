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
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks';
import {
  useDeleteCommentMutation,
  useVoteCommentListQuery,
  useVoteCommentMutation
} from '@/queries';
import { useMemo } from 'react';
import { queryKeys, REACTION_TYPE_LIKE } from '@/constants';
import { logger } from '@/logger';
import { notify } from '@/utils';
import { getQueryClient } from '@/components/providers';
import { useMovieStore } from '@/store';
import Link from 'next/link';
import { route } from '@/routes';
import { Button } from '@/components/form';
import { DotLoading } from '@/components/loading';

const CommentItemSkeleton = () => {
  return (
    <div className='flex-start flex gap-4'>
      <Skeleton className='skeleton h-12.5 w-12.5 rounded-full' />
      <div className='flex grow flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <Skeleton className='skeleton h-4 w-24 rounded' />
          <Skeleton className='skeleton h-4 w-16 rounded' />
        </div>
        <Skeleton className='skeleton h-4 w-full rounded' />
        <Skeleton className='skeleton h-4 w-3/4 rounded' />
        <div className='flex items-center gap-3'>
          <Skeleton className='skeleton h-4 w-10 rounded' />
          <Skeleton className='skeleton h-4 w-10 rounded' />
          <Skeleton className='skeleton h-4 w-14 rounded' />
        </div>
      </div>
    </div>
  );
};

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
  const movie = useMovieStore((s) => s.movie);
  const setMovie = useMovieStore((s) => s.setMovie);

  const { data: voteCommentListData } = useVoteCommentListQuery({
    movieId: movie?.id?.toString() || '',
    enabled: isAuthenticated && !!movie?.id
  });

  const voteCommentList: CommentVoteResType[] = useMemo(
    () => voteCommentListData?.data || [],
    [voteCommentListData?.data]
  );

  const voteMap = useMemo(() => {
    const maps: Record<string, number> = {};
    voteCommentList.forEach((vote) => {
      if (vote?.id && vote?.type !== undefined) {
        maps[vote.id] = vote.type;
      }
    });
    return maps;
  }, [voteCommentList]);

  const { mutateAsync: deleteCommentMutate } = useDeleteCommentMutation();
  const { mutateAsync: voteCommentMutate, isPending: voteCommentLoading } =
    useVoteCommentMutation();

  const handleDeleteComment = async (comment: CommentResType) => {
    await deleteCommentMutate(comment.id, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Xoá bình luận thành công');

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [queryKeys.COMMENT_LIST]
            }),
            queryClient.invalidateQueries({
              queryKey: [queryKeys.MOVIE, movie?.id?.toString()]
            })
          ]);

          if (comment.parent) {
            await queryClient.invalidateQueries({
              queryKey: [
                `${queryKeys.COMMENT_LIST}-replies-${comment.parent.id}`
              ]
            });
          }

          const newMovieData = queryClient.getQueryData<
            ApiResponse<MovieResType>
          >([queryKeys.MOVIE, movie?.id?.toString()]);
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
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
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
                queryKey: [queryKeys.COMMENT_VOTE_LIST, movie?.id?.toString()]
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
    list: CommentResType[],
    level: number,
    rootId?: string
  ) => {
    return list.map((comment) => (
      <CommentItem
        key={comment.id}
        comment={comment}
        isAuthenticated={isAuthenticated}
        isVoteLoading={voteCommentLoading}
        level={level}
        rootId={rootId ?? comment.id}
        userId={profile?.id || ''}
        voteMap={voteMap}
        onDelete={() => handleDeleteComment(comment)}
        onVote={handleVote}
        renderChildren={renderChildren}
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
        className='dark:bg-background/30 mt-4 min-h-30 rounded-lg px-8 py-12 opacity-50'
        content='Chưa có bình luận nào'
        size={50}
        src={emptyDiscussion.src}
      />
    );

  return (
    <div className='mt-8 flex flex-col justify-between gap-2'>
      {renderChildren(commentList, 0)}
      {hasMore && (
        <div className='flex justify-center'>
          <Button
            className='hover:text-light-golden-yellow min-w-45 text-sm hover:bg-transparent'
            variant='ghost'
            onClick={onLoadMore}
          >
            {isLoadMoreLoading ? (
              <DotLoading />
            ) : (
              remainingCount > 0 && `Xem thêm (${remainingCount}) bình luận`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
