'use client';

import { movieApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { MovieSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMovieListQuery = ({
  params = {},
  enabled = false
}: {
  params?: MovieSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_LIST, params],
    queryFn: () => movieApiRequest.getList(params),
    enabled
  });
};

export const useMovieQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE, id],
    queryFn: () => movieApiRequest.getById(id),
    enabled: !!id
  });
};

export const useSuggestionMovieListQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_SUGGESTION_LIST, id],
    queryFn: () => movieApiRequest.getSuggestionList(id),
    enabled: !!id
  });
};

export const useMovieHistoryListQuery = ({
  enabled
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_HISTORY],
    queryFn: () => movieApiRequest.getHistoryList(),
    enabled
  });
};
