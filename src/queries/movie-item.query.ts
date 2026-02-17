import { movieItemApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { MovieItemSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMovieItemListQuery = ({
  params = {},
  enabled
}: {
  params?: MovieItemSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_ITEM_LIST, params],
    queryFn: () => movieItemApiRequest.getList(params),
    enabled
  });
};
