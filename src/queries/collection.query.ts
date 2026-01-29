import { collectionApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { CollectionSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCollectionListQuery = (params?: CollectionSearchType) => {
  return useQuery({
    queryKey: [queryKeys.COLLECTION, params],
    queryFn: () => collectionApiRequest.getList(params)
  });
};
