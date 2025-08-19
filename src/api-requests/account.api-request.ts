import { apiConfig } from '@/constants';
import { ApiResponse, ProfileResType, UpdateProfileBodyType } from '@/types';
import { http } from '@/utils';

const accountApiRequest = {
  getProfile: async () =>
    await http.get<ApiResponse<ProfileResType>>(apiConfig.user.getProfile),
  updateProfile: async (body: UpdateProfileBodyType) =>
    await http.post<ApiResponse<any>>(apiConfig.user.updateProfile, {
      body
    })
};

export default accountApiRequest;
