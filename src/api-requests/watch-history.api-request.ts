import { apiConfig } from '@/constants';
import {
  ApiResponse,
  WatchHistoryResType,
  WatchHistorySearchType,
  WatchHistoryType
} from '@/types';
import { http } from '@/utils';

const watchHistoryApiRequest = {
  getList: (params: WatchHistorySearchType) =>
    http.get<ApiResponse<WatchHistoryResType>>(apiConfig.watchHistory.getList, {
      params
    }),
  tracking: (body: WatchHistoryType) =>
    http.post<ApiResponse<any>>(apiConfig.watchHistory.tracking, { body })
};

export default watchHistoryApiRequest;
