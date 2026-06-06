import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseNoData,
  ChangePasswordBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RequestForgotPasswordBodyType,
  SessionResType,
  VerifyOtpBodyType
} from '@/types';
import { http } from '@/utils';

export const getGoogleLoginUrl = (
  loginType: string | number,
  signal?: AbortSignal
) =>
  http.get<ApiResponse<string>>(apiConfig.user.auth.socialLogin, {
    params: { loginType },
    signal
  });

export const loginGoogle = (code: string) =>
  http.post<ApiResponse<LoginResType>>(apiConfig.api.auth.loginGoogle, {
    body: { code }
  });

export const loginGoogleCallback = (code: string) =>
  http.post<LoginResType>(apiConfig.user.auth.webCallback, {
    body: { code }
  });

export const login = (body: LoginBodyType) =>
  http.post<ApiResponse<LoginResType>>(apiConfig.api.auth.login, {
    body
  });

export const register = (body: RegisterBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.user.register, {
    body
  });

export const logout = () =>
  http.post<ApiResponseNoData>(apiConfig.api.auth.logout);

export const requestForgotPassword = (body: RequestForgotPasswordBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.user.requestForgotPassword, {
    body
  });

export const forgotPassword = (body: Pick<ForgotPasswordBodyType, 'email'>) =>
  http.post<ApiResponseNoData>(apiConfig.user.forgotPassword, {
    body
  });

export const resendOtp = (body: { email: string }) =>
  http.post<ApiResponseNoData>(apiConfig.user.resendOtp, {
    body
  });

export const verifyOtp = (body: VerifyOtpBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.user.verifyOtp, {
    body
  });

export const changePassword = (
  body: Omit<ChangePasswordBodyType, 'confirmNewPassword'>
) => http.post<ApiResponseNoData>(apiConfig.user.changePassword, { body });

export const session = (signal?: AbortSignal) =>
  http.get<ApiResponse<SessionResType>>(apiConfig.api.auth.session, {
    signal
  });
