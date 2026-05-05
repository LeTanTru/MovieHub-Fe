import { apiConfig, queryKeys } from '@/constants';
import type {
  ApiResponse,
  ApiResponseList,
  NotificationResType,
  NotificationSearchType,
  UnreadCountNotificationResType,
  UpdateReadNotificationBodyType
} from '@/types';
import { http } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetNotificationListQuery = ({
  params,
  enabled
}: {
  params?: NotificationSearchType;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.NOTIFICATION_LIST, params],
    queryFn: () =>
      http.get<ApiResponseList<NotificationResType>>(
        apiConfig.notification.getList,
        { params }
      ),
    select: (data) => data.data,
    enabled
  });
};

export const useCountUnreadNotificationQuery = () => {
  return useQuery({
    queryKey: [queryKeys.UNREAD_NOTIFICATION_COUNT],
    queryFn: () =>
      http.get<ApiResponse<UnreadCountNotificationResType>>(
        apiConfig.notification.countUnread
      ),
    select: (data) => data.data
  });
};

export const useUpdateReadNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.UPDATE_READ_NOTIFICATION],
    mutationFn: (body: UpdateReadNotificationBodyType) =>
      http.put<ApiResponse<any>>(apiConfig.notification.updateRead, {
        body
      })
  });
};

export const useReadAllNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.READ_ALL_NOTIFICATION],
    mutationFn: () => http.put<ApiResponse<any>>(apiConfig.notification.readAll)
  });
};

export const useDeleteNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_NOTIFICATION],
    mutationFn: (id: string) =>
      http.delete<ApiResponse<any>>(apiConfig.notification.delete, {
        pathParams: { id }
      })
  });
};

export const useDeleteAllNotificationMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_ALL_NOTIFICATION],
    mutationFn: () =>
      http.delete<ApiResponse<any>>(apiConfig.notification.deleteAll)
  });
};
