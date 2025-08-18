import { personApiRequest } from '@/api-requests';
import { useQuery } from '@tanstack/react-query';

export const usePersonQuery = () => {
  const res = useQuery({
    queryKey: ['persons'],
    queryFn: async () => await personApiRequest.getList()
    // enabled: false
  });
  return res.data?.data;
};
