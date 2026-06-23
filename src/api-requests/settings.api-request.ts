import { apiConfig } from '@/constants';
import {
  ApiResponse,
  PublicSettingResType,
  type ApiResponseNoData,
  type SettingBodyType
} from '@/types';
import { http } from '@/utils';

export const updateSetting = (body: SettingBodyType) =>
  http.put<ApiResponseNoData>(apiConfig.user.updateSetting, {
    body
  });

export const getPublicSetting = () =>
  http.get<ApiResponse<PublicSettingResType[]>>(apiConfig.setting.public);
