import { apiConfig } from '@/constants';
import { ProfileType } from '@/types';
import http from '@/utils/http.util';

const accountApiRequest = {
  getProfile: async () => await http.get<ProfileType>(apiConfig.user.getProfile)
};

export default accountApiRequest;
