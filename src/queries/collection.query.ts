import { collectionApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { CollectionSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCollectionTopicListQuery = ({
  params,
  enabled
}: {
  params?: CollectionSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [`${queryKeys.COLLECTION}-topic-list`, params],
    queryFn: () => collectionApiRequest.getTopicList({ params }),
    enabled
  });
};

export const useCollectionQuery = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [queryKeys.COLLECTION, id],
    queryFn: () => collectionApiRequest.getById({ id }),
    enabled: !!id
  });
};
