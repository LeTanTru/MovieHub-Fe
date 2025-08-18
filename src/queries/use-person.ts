import { personApiRequest } from '@/api-requests';
import { useQuery } from '@tanstack/react-query';

export const usePersonQuery = ({
  page,
  size
}: {
  page?: string | number;
  size?: string | number;
}) => {
  return useQuery({
    queryKey: ['persons', page],
    queryFn: async () => await personApiRequest.getList({ page, size }),
    enabled: true
  });
};
