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

const notificationApiRequest = {
  getList: (params?: NotificationSearchType) =>
    http.get<ApiResponseList<NotificationResType>>(
      apiConfig.notification.getList,
      { params }
    ),

  countUnread: () =>
    http.get<ApiResponse<UnreadCountNotificationResType>>(
      apiConfig.notification.countUnread
    ),

  updateRead: (body: UpdateReadNotificationBodyType) =>
    http.put<ApiResponse<any>>(apiConfig.notification.updateRead, {
      body
    }),

  readAll: () => http.put<ApiResponse<any>>(apiConfig.notification.readAll),

  delete: (id: string) =>
    http.delete<ApiResponse<any>>(apiConfig.notification.delete, {
      pathParams: { id }
    }),

  deleteAll: () =>
    http.delete<ApiResponse<any>>(apiConfig.notification.deleteAll)
};

export default notificationApiRequest;
