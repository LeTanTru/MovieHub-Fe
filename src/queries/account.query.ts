import { accountApiRequest } from '@/api-requests';
import { useAuthStore } from '@/store';
import { ProfileResType, UpdateProfileBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useProfileQuery = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => accountApiRequest.getProfile(),
    enabled: enabled
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (body: UpdateProfileBodyType) =>
      accountApiRequest.updateProfile(body),
    onSuccess: async () => {
      const res = await accountApiRequest.getProfile();
      useAuthStore.getState().setProfile(res.data as ProfileResType);
    }
  });
};
