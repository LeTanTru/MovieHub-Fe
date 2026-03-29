import { commentApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import {
  CommentSearchType,
  CommentBodyType,
  VoteCommentBodyType
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useCreateCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.CREATE_COMMENT],
    mutationFn: (body: CommentBodyType) => commentApiRequest.create(body)
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
    mutationFn: (body: CommentBodyType) => commentApiRequest.update(body)
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
