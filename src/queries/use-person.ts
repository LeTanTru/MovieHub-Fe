'use client';

import { personApiRequest } from '@/api-requests';
import { useQuery } from '@tanstack/react-query';

export const usePersonListQuery = ({
  page,
  size
}: {
  page?: string | number;
  size?: string | number;
}) => {
  return useQuery({
    queryKey: ['persons', page],
    queryFn: async () => await personApiRequest.getList({ page, size })
  });
};

export const usePersonQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['person', id],
    queryFn: async () => await personApiRequest.getById({ id })
  });
};
