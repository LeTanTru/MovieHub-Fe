import { apiConfig } from '@/constants';
import {
  ApiResponse,
  LoginBodyType,
  LoginResponse,
  Payload,
  RegisterBodyType
} from '@/types';
import { http } from '@/utils';

const authApiRequest = {
  getGoogleLoginUrl: (loginType: string | number) =>
    http.get<ApiResponse<any>>(apiConfig.user.auth.socialLogin, {
      params: { loginType }
    }),
  loginGoogle: (code: string) =>
    http.post<ApiResponse<any>>(apiConfig.api.auth.loginGoogle, {
      body: { code }
    }),
  loginGoogleCallback: (code: string) =>
    http.post<LoginResponse>(apiConfig.user.auth.webCallback, {
      body: { code }
    }),
  logout: () => http.post<ApiResponse<any>>(apiConfig.api.auth.logout),
  login: (body: LoginBodyType) =>
    http.post<ApiResponse<any> & LoginResponse>(apiConfig.api.auth.login, {
      body
    }),
  loginFromNextServer: (body: Payload) =>
    http.post<ApiResponse<any> & LoginResponse>(apiConfig.user.login, {
      body
    }),
  register: (body: RegisterBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.user.register, {
      body: body
    })
};

export default authApiRequest;
