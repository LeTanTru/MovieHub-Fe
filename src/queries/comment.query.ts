import { commentApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { CommentSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCommentListQuery = ({
  params,
  enabled
}: {
  params?: CommentSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [`${queryKeys.COMMENT}-list`, params],
    queryFn: () => commentApiRequest.getList({ params }),
    enabled
  });
};
