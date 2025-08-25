'use client';

import { personApiRequest } from '@/api-requests';
import { PersonSearchParamType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const usePersonListQuery = (
  params: PersonSearchParamType,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: ['persons', params],
    queryFn: async () => await personApiRequest.getList(params),
    enabled
  });
};

export const usePersonQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['person', id],
    queryFn: async () => await personApiRequest.getById({ id })
  });
};
