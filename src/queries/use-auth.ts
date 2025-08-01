import { authApiRequest } from '@/apiRequests';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLoginGoogleQuery = (loginType: string | number) => {
  return useQuery({
    queryKey: ['loginGoogle', loginType],
    queryFn: () => authApiRequest.getGoogleLoginUrl({ params: { loginType } }),
    enabled: false
  });
};

export const useLoginGoogleMutation = () => {
  return useMutation({
    mutationFn: async (code: string) => authApiRequest.loginGoogle(code)
  });
};
