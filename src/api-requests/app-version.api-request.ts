import { apiConfig } from '@/constants';
import { ApiResponse, AppVersionLatestResType } from '@/types';
import { http } from '@/utils';

export const getLatest = (signal?: AbortSignal) =>
  http.get<ApiResponse<AppVersionLatestResType>>(
    apiConfig.appVersion.getLatest,
    { signal }
  );
