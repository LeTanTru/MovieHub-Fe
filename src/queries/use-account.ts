import { accountApiRequest } from '@/api-requests';
import { useAuthStore } from '@/store';
import { ProfileResType, UpdateProfileBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useProfileQuery = (immediate: boolean = false) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => accountApiRequest.getProfile(),
    enabled: immediate
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
