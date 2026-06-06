import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseList,
  FavouriteDeleteType,
  FavouriteBodyType,
  FavouriteGetType,
  FavouriteResType,
  FavouriteSearchType,
  FavouriteListIdsResType,
  ApiResponseNoData
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: FavouriteSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<FavouriteResType>>(apiConfig.favourite.getList, {
    params,
    signal
  });

export const get = (params: FavouriteGetType, signal?: AbortSignal) =>
  http.get<ApiResponse<{ id: string }>>(apiConfig.favourite.get, {
    params,
    signal
  });

export const create = (body: FavouriteBodyType) =>
  http.post<ApiResponse<string>>(apiConfig.favourite.create, {
    body
  });

export const deleteById = (params: FavouriteDeleteType) =>
  http.delete<ApiResponseNoData>(apiConfig.favourite.delete, {
    params
  });

export const getListIds = (
  params?: FavouriteSearchType,
  signal?: AbortSignal
) =>
  http.get<ApiResponse<FavouriteListIdsResType>>(
    apiConfig.favourite.getListIds,
    {
      params,
      signal
    }
  );
