import reviewApiRequest from '@/api-requests/review.api-request';
import { queryKeys } from '@/constants';
import { ReviewSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCommentListQuery = ({
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
