import { accountApiRequest } from '@/api-requests';
import { useAuthStore } from '@/store';
import { ProfileResType, UpdateProfileBodyType } from '@/types';
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
    mutationFn: (body: UpdateProfileBodyType) =>
      accountApiRequest.updateProfile(body),
    onSuccess: async () => {
      const response = await accountApiRequest.getProfile();
      useAuthStore.getState().setProfile(response.data as ProfileResType);
    }
  });
};
