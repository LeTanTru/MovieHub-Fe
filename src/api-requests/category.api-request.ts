import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CategoryResType,
  CategorySearchType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: CategorySearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<CategoryResType>>(apiConfig.category.getList, {
    params,
    signal
  });

export const getById = (id: string, signal?: AbortSignal) =>
  http.get<ApiResponse<CategoryResType>>(apiConfig.category.getById, {
    pathParams: {
      id
    },
    signal
  });
