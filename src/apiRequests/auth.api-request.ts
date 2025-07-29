import { apiConfig } from '@/constants';
import { Payload } from '@/types';
import http from '@/utils/http.util';

const authApiRequest = {
  loginGoogle: async (payload?: Payload) =>
    await http.get(apiConfig.user.auth.socialLogin, payload)
};

export default authApiRequest;
