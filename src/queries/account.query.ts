import { accountApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useAuthStore } from '@/store';
import { ProfileResType, UpdateProfileBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useProfileQuery = (enabled: boolean = false) => {
  return useQuery({
    queryKey: [queryKeys.PROFILE],
    queryFn: () => accountApiRequest.getProfile(),
    enabled: enabled
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationKey: [`update-${queryKeys.PROFILE}`],
    mutationFn: (body: UpdateProfileBodyType) =>
      accountApiRequest.updateProfile(body),
    onSuccess: async () => {
      const res = await accountApiRequest.getProfile();
      useAuthStore.getState().setProfile(res.data as ProfileResType);
    }
  });
};
