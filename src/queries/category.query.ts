import { categoryApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { CategorySearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCategoryListQuery = ({
  params = {},
  enabled
}: {
  params?: CategorySearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.CATEGORY_LIST, params],
    queryFn: ({ signal }) => categoryApiRequest.getList(params, signal),
    enabled,
    select: (data) => data.data
  });
};

export const useCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.CATEGORY, id],
    queryFn: ({ signal }) => categoryApiRequest.getById(id, signal),
    enabled: !!id,
    select: (data) => data.data
  });
};
