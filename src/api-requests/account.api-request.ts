import { apiConfig } from '@/constants';
import { ApiResponse, ProfileResType, UpdateProfileBodyType } from '@/types';
import { http } from '@/utils';

const accountApiRequest = {
  getProfile: () =>
    http.get<ApiResponse<ProfileResType>>(apiConfig.user.getProfile),
  updateProfile: (body: UpdateProfileBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.user.updateProfile, {
      body
    })
};

export default accountApiRequest;
