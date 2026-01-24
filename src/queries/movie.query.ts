'use client';

import { movieApiRequest } from '@/api-requests';
import { MovieSearchParamType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMovieListQuery = (params?: MovieSearchParamType) => {
  return useQuery({
    queryKey: ['movieList', params],
    queryFn: () => movieApiRequest.getList(params)
  });
};

export const useMovieQuery = (id: string) => {
  return useQuery({
    queryKey: ['movieDetail', id],
    queryFn: () => movieApiRequest.getById(id)
  });
};
