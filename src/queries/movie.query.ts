'use client';

import { movieApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { MovieSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMovieListQuery = (
  params?: MovieSearchType,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: [`${queryKeys.MOVIE}-list`, params],
    queryFn: () => movieApiRequest.getList(params),
    enabled
  });
};

export const useMovieQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE, id],
    queryFn: () => movieApiRequest.getById(id)
  });
};
