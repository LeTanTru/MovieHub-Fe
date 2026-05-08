import { notificationApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import type {
  NotificationSearchType,
  UpdateReadNotificationBodyType
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useNotificationListQuery = ({
  params,
  enabled
}: {
  params?: NotificationSearchType;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.NOTIFICATION_LIST, params],
    queryFn: () => notificationApiRequest.getList(params),
    select: (data) => data.data,
    enabled
  });
};

export const useCountUnreadNotificationQuery = ({
  enabled
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.UNREAD_NOTIFICATION_COUNT],
    queryFn: () => notificationApiRequest.countUnread(),
    select: (data) => data.data,
    enabled
  });
};

export const useUpdateReadNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.UPDATE_READ_NOTIFICATION],
    mutationFn: (body: UpdateReadNotificationBodyType) =>
      notificationApiRequest.updateRead(body)
  });
};

export const useReadAllNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.READ_ALL_NOTIFICATION],
    mutationFn: () => notificationApiRequest.readAll()
  });
};

export const useDeleteNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_NOTIFICATION],
    mutationFn: (id: string) => notificationApiRequest.delete(id)
  });
};

export const useDeleteAllNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_ALL_NOTIFICATION],
    mutationFn: () => notificationApiRequest.deleteAll()
  });
};
