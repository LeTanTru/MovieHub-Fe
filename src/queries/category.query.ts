'use client';

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
    queryFn: () => categoryApiRequest.getList(params),
    enabled
  });
};

export const useCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.CATEGORY, id],
    queryFn: () => categoryApiRequest.getById(id),
    enabled: !!id
  });
};
