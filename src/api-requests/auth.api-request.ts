import { apiConfig } from '@/constants';
import {
  ApiResponse,
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

export const getGoogleLoginUrl = (loginType: string | number) =>
  http.get<ApiResponse<any>>(apiConfig.user.auth.socialLogin, {
    params: { loginType }
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
  http.post<ApiResponse<any>>(apiConfig.user.register, {
    body: body
  });

export const logout = () =>
  http.post<ApiResponse<any>>(apiConfig.api.auth.logout);

export const requestForgotPassword = (body: RequestForgotPasswordBodyType) =>
  http.post<ApiResponse<any>>(apiConfig.user.requestForgotPassword, {
    body
  });

export const forgotPassword = (body: Pick<ForgotPasswordBodyType, 'email'>) =>
  http.post<ApiResponse<any>>(apiConfig.user.forgotPassword, {
    body
  });

export const resendOtp = (body: { email: string }) =>
  http.post<ApiResponse<any>>(apiConfig.user.resendOtp, {
    body
  });

export const verifyOtp = (body: VerifyOtpBodyType) =>
  http.post<ApiResponse<any>>(apiConfig.user.verifyOtp, {
    body
  });

export const changePassword = (
  body: Omit<ChangePasswordBodyType, 'confirmNewPassword'>
) => http.post<ApiResponse<any>>(apiConfig.user.changePassword, { body });

export const session = () =>
  http.get<ApiResponse<SessionResType>>(apiConfig.api.auth.session);
