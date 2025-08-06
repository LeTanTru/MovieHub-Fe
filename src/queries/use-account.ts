import { accountApiRequest } from '@/apiRequests';
import { UpdateProfileBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => accountApiRequest.getProfile(),
    enabled: false
  });
};

export const useProfileMutation = () => {
  return useMutation({
    mutationFn: async (body: UpdateProfileBodyType) =>
      await accountApiRequest.updateProfile(body)
  });
};
