import { commentApiRequest } from '@/api-requests';
import { DEFAULT_PAGE_START, queryKeys } from '@/constants';
import {
  CommentSearchType,
  CreateCommentBodyType,
  UpdateCommentBodyType,
  VoteCommentBodyType
} from '@/types';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export const useCommentListQuery = ({
  params = {},
  enabled
}: {
  params?: CommentSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.COMMENT_LIST, params],
    queryFn: () => commentApiRequest.getList(params),
    enabled
  });
};

export const useInfiniteCommentListQuery = ({
  params,
  queryKey,
  enabled
}: {
  params: CommentSearchType;
  queryKey: string;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: [queryKey, params],
    queryFn: ({ pageParam }) =>
      commentApiRequest.getList({ ...params, page: pageParam }),
    initialPageParam: DEFAULT_PAGE_START,
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage?.data?.totalPages || 0;
      const nextPage = pages.length;

      return nextPage < totalPages ? nextPage : undefined;
    },
    enabled: enabled
  });
};

export const useCreateCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.CREATE_COMMENT],
    mutationFn: (body: CreateCommentBodyType) => commentApiRequest.create(body)
  });
};

export const useDeleteCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_COMMENT],
    mutationFn: (id: string) => commentApiRequest.delete(id)
  });
};

export const useUpdateCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.UPDATE_COMMENT],
    mutationFn: (body: UpdateCommentBodyType) => commentApiRequest.update(body)
  });
};

export const useVoteCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.VOTE_COMMENT],
    mutationFn: (body: VoteCommentBodyType) => commentApiRequest.vote(body)
  });
};

export const useVoteCommentListQuery = ({
  movieId,
  enabled
}: {
  movieId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.COMMENT_VOTE_LIST, movieId],
    queryFn: () => commentApiRequest.getVoteList(movieId),
    enabled
  });
};
