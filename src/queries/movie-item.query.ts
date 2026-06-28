import { movieItemApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { MovieItemSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMovieItemQuery = ({
  id,
  enabled
}: {
  id: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_ITEM, id],
    queryFn: () => movieItemApiRequest.getById(id),
    enabled,
    select: (data) => data.data
  });
};

export const useMovieItemListQuery = ({
  params,
  enabled
}: {
  params?: MovieItemSearchType;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_ITEM, params],
    queryFn: ({ signal }) => movieItemApiRequest.getList(params, signal),
    enabled,
    select: (data) => data?.data?.content || []
  });
};
