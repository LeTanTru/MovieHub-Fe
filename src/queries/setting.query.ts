import { settingApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { SettingBodyType } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useUpdateSettingMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.UPDATE_SETTING],
    mutationFn: (body: SettingBodyType) => settingApiRequest.updateSetting(body)
  });
};
