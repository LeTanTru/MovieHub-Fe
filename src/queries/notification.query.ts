import { notificationApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import type { UpdateReadNotificationBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCountUnreadNotificationQuery = ({
  enabled
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.UNREAD_NOTIFICATION_COUNT],
    queryFn: ({ signal }) => notificationApiRequest.countUnread(signal),
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
    mutationFn: (id: string) => notificationApiRequest.deleteById(id)
  });
};

export const useDeleteAllNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_ALL_NOTIFICATION],
    mutationFn: () => notificationApiRequest.deleteAll()
  });
};
