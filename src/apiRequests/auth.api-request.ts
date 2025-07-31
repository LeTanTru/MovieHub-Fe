import { apiConfig } from '@/constants';
import { ApiResponse, LoginResponse, Payload } from '@/types';
import http from '@/utils/http.util';

const authApiRequest = {
  getGoogleLoginUrl: async (payload?: Payload) =>
    await http.get<ApiResponse<any>>(apiConfig.user.auth.socialLogin, payload),
  loginGoogle: async (code: string) =>
    http.post<ApiResponse<any>>(apiConfig.api.auth.loginGoogle, {
      data: { code }
    }),
  loginGoogleCallback: async (code: string) =>
    http.post<LoginResponse>(apiConfig.user.auth.webCallback, {
      data: { code }
    }),
  logout: async () => http.post(apiConfig.api.auth.logout)
};

export default authApiRequest;
