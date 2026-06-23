import { settingsApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { SettingBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useUpdateSettingsMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.UPDATE_SETTING],
    mutationFn: (body: SettingBodyType) =>
      settingsApiRequest.updateSetting(body)
  });
};

export const usePublicSettingQuery = () => {
  return useQuery({
    queryKey: [queryKeys.PUBLIC_SETTING],
    queryFn: () => settingsApiRequest.getPublicSetting(),
    select: (data) => data?.data || []
  });
};
