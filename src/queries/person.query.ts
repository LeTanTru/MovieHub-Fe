import { personApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import type { PersonSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const usePersonListQuery = ({
  params = {},
  enabled
}: {
  params?: PersonSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.PERSON_LIST, params],
    queryFn: ({ signal }) => personApiRequest.getList(params, signal),
    enabled,
    select: (data) => data.data
  });
};

export const usePersonQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.PERSON, id],
    queryFn: ({ signal }) => personApiRequest.getById(id, signal),
    enabled: !!id
  });
};
