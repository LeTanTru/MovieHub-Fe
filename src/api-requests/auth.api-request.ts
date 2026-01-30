import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginResponseType,
  RegisterBodyType,
  RequestForgotPasswordBodyType,
  VerifyOtpBodyType
} from '@/types';
import { http } from '@/utils';

const authApiRequest = {
  getGoogleLoginUrl: ({ loginType }: { loginType: string | number }) =>
    http.get<ApiResponse<any>>(apiConfig.user.auth.socialLogin, {
      params: { loginType }
    }),
  loginGoogle: (code: string) =>
    http.post<ApiResponse<any> & LoginResponseType>(
      apiConfig.api.auth.loginGoogle,
      {
        body: { code }
      }
    ),
  loginGoogleCallback: ({ code }: { code: string }) =>
    http.post<LoginResponseType>(apiConfig.user.auth.webCallback, {
      body: { code }
    }),
  login: (body: LoginBodyType) =>
    http.post<ApiResponse<any> & LoginResponseType>(apiConfig.api.auth.login, {
      body
    }),
  loginFromNextServer: ({ body }: { body: LoginBodyType }) =>
    http.post<ApiResponse<any> & LoginResponseType>(apiConfig.user.login, {
      body
    }),
  register: (body: RegisterBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.user.register, {
      body: body
    }),
  logout: () => http.post<ApiResponse<any>>(apiConfig.api.auth.logout),
  logoutFromNextServer: () =>
    http.post<ApiResponse<any>>(apiConfig.user.logout),
  requestForgotPassword: (body: RequestForgotPasswordBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.user.requestForgotPassword, {
      body
    }),
  forgotPassword: (body: Pick<ForgotPasswordBodyType, 'email'>) =>
    http.post<ApiResponse<any>>(apiConfig.user.forgotPassword, {
      body
    }),
  resendOtp: (body: { email: string }) =>
    http.post<ApiResponse<any>>(apiConfig.user.resendOtp, {
      body
    }),
  verifyOtp: (body: VerifyOtpBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.user.verifyOtp, {
      body
    })
};

export default authApiRequest;
