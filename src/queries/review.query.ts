import { reviewApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { ReviewBodyType, ReviewVoteBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

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
    enabled,
    select: (data) => data.data
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
    enabled,
    select: (data) => data.data
  });
};
