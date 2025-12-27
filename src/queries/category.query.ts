'use client';

import { categoryApiRequest } from '@/api-requests';
import { useQuery } from '@tanstack/react-query';

export const useCategoryListQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApiRequest.getList()
  });
};
