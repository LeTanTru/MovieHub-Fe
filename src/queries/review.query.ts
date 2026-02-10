import { reviewApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { ReviewBodyType, ReviewSearchType, ReviewVoteBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useReviewVoteListQuery = ({
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
