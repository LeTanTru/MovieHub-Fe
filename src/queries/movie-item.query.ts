import { movieItemApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { MovieItemSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMovieItemListQuery = (params?: MovieItemSearchType) => {
  return useQuery({
    queryKey: [`${queryKeys.MOVIE_ITEM}-list`, params],
    queryFn: () => movieItemApiRequest.getList(params)
  });
};
