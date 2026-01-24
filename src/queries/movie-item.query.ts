import { movieItemApiRequest } from '@/api-requests';
import { MovieItemSearchParamType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMovieItemListQuery = (params?: MovieItemSearchParamType) => {
  return useQuery({
    queryKey: ['movieItems', params],
    queryFn: () => movieItemApiRequest.getList(params)
  });
};
