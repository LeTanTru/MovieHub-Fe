import { accountApiRequest } from '@/apiRequests';
import { useAuthStore } from '@/store';
import { ProfileResType, UpdateProfileBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => accountApiRequest.getProfile()
  });
};

export const useProfileMutation = () => {
  return useMutation({
    mutationFn: async (body: UpdateProfileBodyType) =>
      await accountApiRequest.updateProfile(body),
    onSuccess: async () => {
      const response = await accountApiRequest.getProfile();
      useAuthStore.getState().setProfile(response.data as ProfileResType);
    }
  });
};
