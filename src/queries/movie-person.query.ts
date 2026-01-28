'use client';

import { moviePersonApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { MoviePersonSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMoviePersonListQuery = (params: MoviePersonSearchType) => {
  return useQuery({
    queryKey: [`${queryKeys.MOVIE_PERSON}-list`, params],
    queryFn: () => moviePersonApiRequest.getList(params)
  });
};
