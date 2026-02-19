import { watchHistoryApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { WatchHistorySearchType, WatchHistoryType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useWatchHistoryListQuery = ({
  params,
  enabled
}: {
  params: WatchHistorySearchType;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.WATCH_HISTORY_LIST, params],
    queryFn: () => watchHistoryApiRequest.getList(params),
    enabled
  });
};

export const useWatchHistoryTrackingMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.WATCH_HISTORY_TRACKING],
    mutationFn: (body: WatchHistoryType) =>
      watchHistoryApiRequest.tracking(body)
  });
};

export const useDeleteWatchHistoryMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.WATCH_HISTORY_DELETE],
    mutationFn: (movieId: string) => watchHistoryApiRequest.delete(movieId)
  });
};
