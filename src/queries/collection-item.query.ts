import { collectionItemApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { CollectionItemSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCollectionItemListQuery = ({
  params,
  enabled
}: { params?: CollectionItemSearchType; enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: [`${queryKeys.COLLECTION_ITEM}-list`, params],
    queryFn: () => collectionItemApiRequest.getList({ params }),
    enabled
  });
};
