import { userReportApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import type { UserReportBodyType } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useCreateUserReportMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.CREATE_USER_REPORT],
    mutationFn: (body: UserReportBodyType) => userReportApiRequest.create(body)
  });
};
