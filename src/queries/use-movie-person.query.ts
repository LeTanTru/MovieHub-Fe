'use client';

import { moviePersonApiRequest } from '@/api-requests';
import { MoviePersonSearchParamType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMoviePersonListQuery = (params: MoviePersonSearchParamType) => {
  return useQuery({
    queryKey: ['moviePersons', params],
    queryFn: async () => await moviePersonApiRequest.getList(params)
  });
};
