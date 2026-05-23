import { apiConfig } from '@/constants';
import type { ApiResponseNoData, SettingBodyType } from '@/types';
import { http } from '@/utils';

export const updateSetting = (body: SettingBodyType) =>
  http.put<ApiResponseNoData>(apiConfig.user.updateSetting, {
    body
  });
