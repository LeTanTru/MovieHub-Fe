import { sidebarApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { SidebarSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useSidebarListQuery = ({
  params = {},
  enabled
}: {
  params?: SidebarSearchType;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.SIDEBAR_LIST, params],
    queryFn: ({ signal }) => sidebarApiRequest.getList(params, signal),
    enabled,
    select: (data) => data.data
  });
};
