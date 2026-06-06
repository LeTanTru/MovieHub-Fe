import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseNoData,
  ProfileResType,
  UpdateProfileBodyType
} from '@/types';
import { http } from '@/utils';

export const getProfile = (signal?: AbortSignal) =>
  http.get<ApiResponse<ProfileResType>>(apiConfig.user.getProfile, {
    signal
  });

export const updateProfile = (body: UpdateProfileBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.user.updateProfile, {
    body
  });
