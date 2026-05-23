import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  WatchHistoryResType,
  WatchHistorySearchType,
  WatchHistoryBodyType,
  ApiResponseNoData
} from '@/types';
import { http } from '@/utils';

export const getList = (params: WatchHistorySearchType) =>
  http.get<ApiResponse<WatchHistoryResType>>(apiConfig.watchHistory.getList, {
    params
  });

export const tracking = (body: WatchHistoryBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.watchHistory.tracking, { body });

export const deleteById = (movieId: string) =>
  http.delete<ApiResponseNoData>(apiConfig.watchHistory.delete, {
    pathParams: { movieId }
  });
