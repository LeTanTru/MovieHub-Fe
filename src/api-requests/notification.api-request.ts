import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseList,
  ApiResponseNoData,
  NotificationResType,
  NotificationSearchType,
  UnreadCountNotificationResType,
  UpdateReadNotificationBodyType
} from '@/types';
import { http } from '@/utils';

export const getList = (
  params?: NotificationSearchType,
  signal?: AbortSignal
) =>
  http.get<ApiResponseList<NotificationResType>>(
    apiConfig.notification.getList,
    { params, signal }
  );

export const countUnread = (signal?: AbortSignal) =>
  http.get<ApiResponse<UnreadCountNotificationResType>>(
    apiConfig.notification.countUnread,
    { signal }
  );

export const updateRead = (body: UpdateReadNotificationBodyType) =>
  http.put<ApiResponseNoData>(apiConfig.notification.updateRead, {
    body
  });

export const readAll = () =>
  http.put<ApiResponseNoData>(apiConfig.notification.readAll);

export const deleteById = (id: string) =>
  http.delete<ApiResponseNoData>(apiConfig.notification.delete, {
    pathParams: { id }
  });

export const deleteAll = () =>
  http.delete<ApiResponseNoData>(apiConfig.notification.deleteAll);
