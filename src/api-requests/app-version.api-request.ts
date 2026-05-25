import { apiConfig } from '@/constants';
import { ApiResponse, AppVersionLatestResType } from '@/types';
import { http } from '@/utils';

export const getLatest = () =>
  http.get<ApiResponse<AppVersionLatestResType>>(
    apiConfig.appVersion.getLatest
  );
