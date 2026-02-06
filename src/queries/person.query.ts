'use client';

import { personApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { PersonSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const usePersonListQuery = ({
  params,
  enabled
}: {
  params?: PersonSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.PERSON_LIST, params],
    queryFn: () => personApiRequest.getList({ params }),
    enabled
  });
};

export const usePersonQuery = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [queryKeys.PERSON, id],
    queryFn: () => personApiRequest.getById({ id }),
    enabled: !!id
  });
};
