import { apiConfig } from '@/constants';
import { ApiResponse, ProfileType } from '@/types';
import http from '@/utils/http.util';

const accountApiRequest = {
  getProfile: async () =>
    await http.get<ApiResponse<ProfileType>>(apiConfig.user.getProfile)
};

export default accountApiRequest;
