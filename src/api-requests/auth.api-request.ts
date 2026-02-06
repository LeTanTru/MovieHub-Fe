import { apiConfig } from '@/constants';
import {
  AnonymousResType,
  ApiResponse,
  ChangePasswordBodyType,
  CookieServerBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginResType,
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
    http.post<ApiResponse<any> & LoginResType>(apiConfig.api.auth.loginGoogle, {
      body: { code }
    }),
  loginGoogleCallback: ({ code }: { code: string }) =>
    http.post<LoginResType>(apiConfig.user.auth.webCallback, {
      body: { code }
    }),
  login: (body: LoginBodyType) =>
    http.post<ApiResponse<any> & LoginResType>(apiConfig.user.login, {
      body
    }),
  setCookieServer: ({ body }: { body: CookieServerBodyType }) =>
    http.post<ApiResponse<any>>(apiConfig.api.auth.login, {
      body
    }),
  register: (body: RegisterBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.user.register, {
      body: body
    }),
  logout: () => http.post<ApiResponse<any>>(apiConfig.user.logout),
  removeCookieServer: () =>
    http.post<ApiResponse<any>>(apiConfig.api.auth.logout),
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
    }),
  getAnonymousToken: () =>
    http.post<AnonymousResType>(apiConfig.user.getAnonymousToken),
  changePassword: (body: Omit<ChangePasswordBodyType, 'confirmNewPassword'>) =>
    http.post<ApiResponse<any>>(apiConfig.user.changePassword, { body })
};

export default authApiRequest;
