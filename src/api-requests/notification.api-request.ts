import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  NotificationResType,
  NotificationSearchType,
  UnreadCountNotificationResType,
  UpdateReadNotificationBodyType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: NotificationSearchType) =>
  http.get<ApiResponseList<NotificationResType>>(
    apiConfig.notification.getList,
    { params }
  );

export const countUnread = () =>
  http.get<ApiResponse<UnreadCountNotificationResType>>(
    apiConfig.notification.countUnread
  );

export const updateRead = (body: UpdateReadNotificationBodyType) =>
  http.put<ApiResponse<any>>(apiConfig.notification.updateRead, {
    body
  });

export const readAll = () =>
  http.put<ApiResponse<any>>(apiConfig.notification.readAll);

export const deleteById = (id: string) =>
  http.delete<ApiResponse<any>>(apiConfig.notification.delete, {
    pathParams: { id }
  });

export const deleteAll = () =>
  http.delete<ApiResponse<any>>(apiConfig.notification.deleteAll);
