import { accountApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useAuthStore } from '@/store';
import type { ProfileResType, UpdateProfileBodyType } from '@/types';
import { getQueryClient } from '@/components/providers/query-provider';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useProfileQuery = ({
  enabled = false
}: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: [queryKeys.PROFILE],
    queryFn: ({ signal }) => accountApiRequest.getProfile(signal),
    enabled: enabled,
    select: (data) => data.data
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.PROFILE_UPDATE],
    mutationFn: (body: UpdateProfileBodyType) =>
      accountApiRequest.updateProfile(body),
    onSuccess: async () => {
      const queryClient = getQueryClient();
      const res = await accountApiRequest.getProfile();
      useAuthStore.getState().setProfile(res.data as ProfileResType);
      queryClient.setQueryData([queryKeys.PROFILE], res);
    }
  });
};
