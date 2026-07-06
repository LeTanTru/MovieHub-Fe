import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  PublicSettingResType,
  ApiResponseNoData,
  SettingBodyType
} from '@/types';
import { http } from '@/utils';

export const updateSetting = (body: SettingBodyType) =>
  http.put<ApiResponseNoData>(apiConfig.user.updateSetting, {
    body
  });

export const getPublicSetting = () =>
  http.get<ApiResponse<PublicSettingResType[]>>(apiConfig.setting.public);
