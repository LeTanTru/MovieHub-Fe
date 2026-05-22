import { apiConfig } from '@/constants';
import {
  ApiResponse,
  WatchHistoryResType,
  WatchHistorySearchType,
  WatchHistoryBodyType
} from '@/types';
import { http } from '@/utils';

export const getList = (params: WatchHistorySearchType) =>
  http.get<ApiResponse<WatchHistoryResType>>(apiConfig.watchHistory.getList, {
    params
  });

export const tracking = (body: WatchHistoryBodyType) =>
  http.post<ApiResponse<any>>(apiConfig.watchHistory.tracking, { body });

export const deleteById = (movieId: string) =>
  http.delete<ApiResponse<any>>(apiConfig.watchHistory.delete, {
    pathParams: { movieId }
  });
