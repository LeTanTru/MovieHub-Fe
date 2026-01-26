import { authApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import {
  ForgotPasswordBodyType,
  LoginBodyType,
  RegisterBodyType
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLoginGoogleQuery = (loginType: string | number) => {
  return useQuery({
    queryKey: [`get-${queryKeys.LOGIN_GOOGLE}`, loginType],
    queryFn: () => authApiRequest.getGoogleLoginUrl(loginType),
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

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.REGISTER],
    mutationFn: (body: RegisterBodyType) => authApiRequest.register(body)
  });
};

export const useRequestForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.REQUEST_FORGOT_PASSSWORD],
    mutationFn: (body: Pick<ForgotPasswordBodyType, 'email'>) =>
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
