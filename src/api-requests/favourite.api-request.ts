import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  FavouriteDeleteType,
  FavouriteBodyType,
  FavouriteGetType,
  FavouriteResType,
  FavouriteSearchType,
  FavouriteListIdsResType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: FavouriteSearchType) =>
  http.get<ApiResponseList<FavouriteResType>>(apiConfig.favourite.getList, {
    params
  });

export const get = (params: FavouriteGetType) =>
  http.get<ApiResponse<{ id: string }>>(apiConfig.favourite.get, {
    params
  });

export const create = (body: FavouriteBodyType) =>
  http.post<ApiResponse<string>>(apiConfig.favourite.create, {
    body
  });

export const deleteById = (params: FavouriteDeleteType) =>
  http.delete<ApiResponse<any>>(apiConfig.favourite.delete, {
    params
  });

export const getListIds = (params?: FavouriteSearchType) =>
  http.get<ApiResponse<FavouriteListIdsResType>>(
    apiConfig.favourite.getListIds,
    {
      params
    }
  );
