'use client';

import { moviePersonApiRequest } from '@/api-requests';
import { MoviePersonSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMoviePersonListQuery = ({
  personId,
  kind
}: MoviePersonSearchType) => {
  return useQuery({
    queryKey: ['moviePersons', personId],
    queryFn: async () => await moviePersonApiRequest.getList({ personId, kind })
  });
};
