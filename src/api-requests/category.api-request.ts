import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CategoryResType,
  CategorySearchType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: CategorySearchType) =>
  http.get<ApiResponseList<CategoryResType>>(apiConfig.category.getList, {
    params
  });

export const getById = (id: string) =>
  http.get<ApiResponse<CategoryResType>>(apiConfig.category.getById, {
    pathParams: {
      id
    }
  });
