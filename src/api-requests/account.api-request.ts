import { apiConfig } from '@/constants';
import { ApiResponse, ProfileResType, UpdateProfileBodyType } from '@/types';
import { http } from '@/utils';

export const getProfile = () =>
  http.get<ApiResponse<ProfileResType>>(apiConfig.user.getProfile);

export const updateProfile = (body: UpdateProfileBodyType) =>
  http.post<ApiResponse<any>>(apiConfig.user.updateProfile, {
    body
  });
