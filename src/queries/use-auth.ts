import { authApiRequest } from '@/apiRequests';
import { LoginBodyType, RegisterBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLoginGoogleQuery = (loginType: string | number) => {
  return useQuery({
    queryKey: ['loginGoogle', loginType],
    queryFn: () => authApiRequest.getGoogleLoginUrl(loginType),
    enabled: false
  });
};

export const useLoginGoogleMutation = () => {
  return useMutation({
    mutationFn: async (code: string) => authApiRequest.loginGoogle(code)
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (body: LoginBodyType) => await authApiRequest.login(body)
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (body: RegisterBodyType) =>
      await authApiRequest.register(body)
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => await authApiRequest.logout()
  });
};
