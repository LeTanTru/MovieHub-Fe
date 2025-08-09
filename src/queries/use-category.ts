'use client';

import { categoryApiRequest } from '@/api-requests';
import { useQuery } from '@tanstack/react-query';

export const useCategoryQuery = () => {
  const res = useQuery({
    queryKey: ['category'],
    queryFn: () => categoryApiRequest.getList()
  });
  return res.data?.data.content || [];
};
