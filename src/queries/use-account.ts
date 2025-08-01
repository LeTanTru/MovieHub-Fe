import { accountApiRequest } from '@/apiRequests';
import { useQuery } from '@tanstack/react-query';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => accountApiRequest.getProfile(),
    enabled: false
  });
};
