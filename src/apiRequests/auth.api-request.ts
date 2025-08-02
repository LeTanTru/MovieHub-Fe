import { apiConfig } from '@/constants';
import {
  ApiResponse,
  LoginBodyType,
  LoginResponse,
  Payload,
  RegisterBodyType
} from '@/types';
import http from '@/utils/http.util';

const authApiRequest = {
  getGoogleLoginUrl: async (loginType: string | number) =>
    await http.get<ApiResponse<any>>(apiConfig.user.auth.socialLogin, {
      params: { loginType }
    }),
  loginGoogle: async (code: string) =>
    http.post<ApiResponse<any>>(apiConfig.api.auth.loginGoogle, {
      body: { code }
    }),
  loginGoogleCallback: async (code: string) =>
    http.post<LoginResponse>(apiConfig.user.auth.webCallback, {
      body: { code }
    }),
  logout: async () => http.post<ApiResponse<any>>(apiConfig.api.auth.logout),
  login: async (body: LoginBodyType) =>
    await http.post<ApiResponse<any> & LoginResponse>(
      apiConfig.api.auth.login,
      {
        body
      }
    ),
  loginFromNextServer: async (body: Payload) =>
    await http.post<ApiResponse<any> & LoginResponse>(apiConfig.user.login, {
      body
    }),
  register: async (body: RegisterBodyType) =>
    await http.post<ApiResponse<any>>(apiConfig.user.register, {
      body: body
    })
};

export default authApiRequest;
