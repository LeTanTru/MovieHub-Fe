'use client';

import { personApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { PersonSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const usePersonListQuery = (
  params: PersonSearchType,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: [`${queryKeys.PERSON}-list`, params],
    queryFn: () => personApiRequest.getList(params),
    enabled
  });
};

export const usePersonQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [queryKeys.PERSON, id],
    queryFn: () => personApiRequest.getById({ id })
  });
};
