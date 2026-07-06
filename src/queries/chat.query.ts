import { chatApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import type { ChatSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useChatListQuery = ({
  params,
  enabled
}: {
  params?: ChatSearchType;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.CHAT_LIST, params],
    queryFn: () => chatApiRequest.getList(params),
    enabled,
    select: (data) => data?.data?.content || []
  });
};
