import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  MovieItemResType,
  MovieItemSearchType
} from '@/types';
import { http } from '@/utils';

export const getById = (id: string, signal?: AbortSignal) =>
  http.get<ApiResponse<MovieItemResType>>(apiConfig.movieItem.getById, {
    pathParams: {
      id
    },
    signal
  });

export const getList = (params?: MovieItemSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<MovieItemResType>>(apiConfig.movieItem.getList, {
    params,
    signal
  });
