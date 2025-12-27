import { authApiRequest } from '@/api-requests';
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
    mutationFn: (code: string) => authApiRequest.loginGoogle(code)
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (body: LoginBodyType) => authApiRequest.login(body)
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (body: RegisterBodyType) => authApiRequest.register(body)
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authApiRequest.logout()
  });
};
