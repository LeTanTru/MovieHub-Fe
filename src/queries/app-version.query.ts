import { appVersionApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useAppVersionLatestQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: [queryKeys.APP_VERSION_LATEST],
    queryFn: ({ signal }) => appVersionApiRequest.getLatest(signal),
    select: (data) => data.data,
    enabled
  });
};
