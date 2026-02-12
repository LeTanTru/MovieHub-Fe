import { reviewApiRequest } from '@/api-requests';
import { DEFALT_PAGE_START, queryKeys } from '@/constants';
import {
  CommentSearchType,
  ReviewBodyType,
  ReviewSearchType,
  ReviewVoteBodyType
} from '@/types';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export const useReviewListQuery = ({
  params,
  enabled
}: {
  params?: ReviewSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.REVIEW_LIST, params],
    queryFn: () => reviewApiRequest.getList({ params }),
    enabled
  });
};

export const useInfiniteReviewListQuery = ({
  params,
  enabled
}: {
  params: CommentSearchType;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: [queryKeys.REVIEW_LIST, params],
    queryFn: ({ pageParam }) =>
      reviewApiRequest.getList({
        params: { ...params, page: pageParam }
      }),
    initialPageParam: DEFALT_PAGE_START,
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage?.data?.totalPages || 0;
      const nextPage = pages.length;

      return nextPage < totalPages ? nextPage : undefined;
    },
    enabled: enabled
  });
};

export const useCheckMovieQuery = ({
  movieId,
  enabled
}: {
  movieId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.CHECK_MOVIE, movieId],
    queryFn: () => reviewApiRequest.checkMovie(movieId),
    enabled
  });
};

export const useCreateReviewMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.CREATE_REVIEW],
    mutationFn: (body: ReviewBodyType) => reviewApiRequest.create(body)
  });
};

export const useDeleteReviewMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_REVIEW],
    mutationFn: (id: string) => reviewApiRequest.delete(id)
  });
};

export const useVoteReviewMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.VOTE_REVIEW],
    mutationFn: (body: ReviewVoteBodyType) => reviewApiRequest.vote(body)
  });
};

export const useVoteReviewListQuery = ({
  movieId,
  enabled
}: {
  movieId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.REVIEW_VOTE_LIST, movieId],
    queryFn: () => reviewApiRequest.getVoteList(movieId),
    enabled
  });
};
