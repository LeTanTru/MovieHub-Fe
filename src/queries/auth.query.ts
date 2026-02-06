import { authApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import {
  ChangePasswordBodyType,
  CookieServerBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  RegisterBodyType,
  RequestForgotPasswordBodyType,
  VerifyOtpBodyType
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLoginGoogleQuery = ({
  loginType
}: {
  loginType: string | number;
}) => {
  return useQuery({
    queryKey: [`get-${queryKeys.LOGIN_GOOGLE}`, loginType],
    queryFn: () => authApiRequest.getGoogleLoginUrl({ loginType }),
    enabled: false
  });
};

export const useLoginGoogleMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.LOGIN_GOOGLE],
    mutationFn: (code: string) => authApiRequest.loginGoogle(code)
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.LOGIN],
    mutationFn: (body: LoginBodyType) => authApiRequest.login(body)
  });
};

export const useSetCookieServerMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.SET_COOKIE_SERVER],
    mutationFn: (body: CookieServerBodyType) =>
      authApiRequest.setCookieServer({ body })
  });
};

export const useRemoveCookieServerMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.REMOVE_COOKIE_SERVER],
    mutationFn: () => authApiRequest.removeCookieServer()
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.REGISTER],
    mutationFn: (body: RegisterBodyType) => authApiRequest.register(body)
  });
};

export const useRequestForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.REQUEST_FORGOT_PASSWORD],
    mutationFn: (body: RequestForgotPasswordBodyType) =>
      authApiRequest.requestForgotPassword(body)
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.FORGOT_PASSWORD],
    mutationFn: (body: ForgotPasswordBodyType) =>
      authApiRequest.forgotPassword(body)
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.LOGOUT],
    mutationFn: () => authApiRequest.logout()
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.RESEND_OTP],
    mutationFn: (body: { email: string }) => authApiRequest.resendOtp(body)
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.VERIFY_OTP],
    mutationFn: (body: VerifyOtpBodyType) => authApiRequest.verifyOtp(body)
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.CHANGE_PASSWORD],
    mutationFn: (body: Omit<ChangePasswordBodyType, 'confirmNewPassword'>) =>
      authApiRequest.changePassword(body)
  });
};
