import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CollectionResType,
  CollectionSearchType
} from '@/types';
import { http } from '@/utils';

export const getTopicList = (params?: CollectionSearchType) =>
  http.get<ApiResponseList<CollectionResType>>(
    apiConfig.collection.getTopicList,
    {
      params
    }
  );

export const getById = (id: string) =>
  http.get<ApiResponse<CollectionResType>>(apiConfig.collection.getById, {
    pathParams: {
      id
    }
  });

export const getList = (params?: CollectionSearchType) =>
  http.get<ApiResponseList<CollectionResType>>(apiConfig.collection.getList, {
    params
  });
