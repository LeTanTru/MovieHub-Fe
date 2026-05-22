import { apiConfig } from '@/constants';
import { ApiResponse, SettingBodyType } from '@/types';
import { http } from '@/utils';

export const updateSetting = (body: SettingBodyType) =>
  http.put<ApiResponse<any>>(apiConfig.user.updateSetting, {
    body
  });
