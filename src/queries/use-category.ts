'use client';

import { categoryApiRequest } from '@/api-requests';
import { useQuery } from '@tanstack/react-query';

export const useCategoryQuery = () => {
  const { data } = useQuery({
    queryKey: ['category'],
    queryFn: () => categoryApiRequest.getList()
  });
  return data?.data?.content || [];
};
