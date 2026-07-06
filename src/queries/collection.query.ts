import { collectionApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import type { CollectionSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCollectionTopicListQuery = ({
  params = {},
  enabled
}: {
  params?: CollectionSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.COLLECTION_TOPIC_LIST, params],
    queryFn: ({ signal }) => collectionApiRequest.getTopicList(params, signal),
    enabled,
    select: (data) => data.data
  });
};

export const useCollectionQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.COLLECTION, id],
    queryFn: ({ signal }) => collectionApiRequest.getById(id, signal),
    enabled: !!id
  });
};
