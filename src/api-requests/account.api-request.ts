import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseNoData,
  ProfileResType,
  UpdateProfileBodyType
} from '@/types';
import { http } from '@/utils';

export const getProfile = () =>
  http.get<ApiResponse<ProfileResType>>(apiConfig.user.getProfile);

export const updateProfile = (body: UpdateProfileBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.user.updateProfile, {
    body
  });
