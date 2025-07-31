import { apiConfig } from '@/constants';
import { LoginResponse, Payload } from '@/types';
import http from '@/utils/http.util';

const authApiRequest = {
  getGoogleLoginUrl: async (payload?: Payload) =>
    await http.get(apiConfig.user.auth.socialLogin, payload),
  loginGoogle: async (code: string) =>
    http.post<LoginResponse>(apiConfig.api.auth.loginGoogle, {
      data: { code }
    }),
  loginGoogleCallback: async (code: string) =>
    http.post<LoginResponse>(apiConfig.user.auth.webCallback, {
      data: { code }
    })
};

export default authApiRequest;
