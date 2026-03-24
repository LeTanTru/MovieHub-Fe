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

const favouriteApiRequest = {
  getList: (params?: FavouriteSearchType) =>
    http.get<ApiResponseList<FavouriteResType>>(apiConfig.favourite.getList, {
      params
    }),
  get: (params: FavouriteGetType) =>
    http.get<ApiResponse<{ id: string }>>(apiConfig.favourite.get, {
      params
    }),
  create: (body: FavouriteBodyType) =>
    http.post<ApiResponse<string>>(apiConfig.favourite.create, {
      body
    }),
  delete: (params: FavouriteDeleteType) =>
    http.delete<ApiResponse<any>>(apiConfig.favourite.delete, {
      params
    }),
  getListIds: (params?: FavouriteSearchType) =>
    http.get<ApiResponse<FavouriteListIdsResType>>(
      apiConfig.favourite.getListIds,
      {
        params
      }
    )
};

export default favouriteApiRequest;
