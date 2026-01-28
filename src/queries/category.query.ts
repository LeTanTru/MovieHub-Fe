'use client';

import { categoryApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { CategorySearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCategoryListQuery = (params?: CategorySearchType) => {
  return useQuery({
    queryKey: [`${queryKeys.CATEGORY}-list`, params],
    queryFn: () => categoryApiRequest.getList(params)
  });
};

export const useCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.CATEGORY, id],
    queryFn: () => categoryApiRequest.getById({ id })
  });
};
