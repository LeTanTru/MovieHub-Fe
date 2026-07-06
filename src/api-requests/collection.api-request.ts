import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseList,
  CollectionResType,
  CollectionSearchType
} from '@/types';
import { http } from '@/utils';

export const getTopicList = (
  params?: CollectionSearchType,
  signal?: AbortSignal
) =>
  http.get<ApiResponseList<CollectionResType>>(
    apiConfig.collection.getTopicList,
    {
      params,
      signal
    }
  );

export const getById = (id: string, signal?: AbortSignal) =>
  http.get<ApiResponse<CollectionResType>>(apiConfig.collection.getById, {
    pathParams: {
      id
    },
    signal
  });

export const getList = (params?: CollectionSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<CollectionResType>>(apiConfig.collection.getList, {
    params,
    signal
  });
