import { moviePersonApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { MoviePersonSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMoviePersonListQuery = ({
  params = {},
  enabled
}: {
  params?: MoviePersonSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_PERSON_LIST, params],
    queryFn: ({ signal }) => moviePersonApiRequest.getList(params, signal),
    enabled,
    select: (data) => data.data.content
  });
};
