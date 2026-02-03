import { reviewApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { ReviewSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useReviewListQuery = ({
  params,
  enabled
}: {
  params?: ReviewSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [`${queryKeys.REVIEW}-list`, params],
    queryFn: () => reviewApiRequest.getList({ params }),
    enabled
  });
};
