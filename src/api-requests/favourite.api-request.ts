import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  FavouriteBodyType,
  FavouriteResType,
  FavouriteSearchType
} from '@/types';
import { http } from '@/utils';

const favouriteApiRequest = {
  getList: ({ params }: { params?: FavouriteSearchType } = {}) =>
    http.get<ApiResponseList<FavouriteResType>>(apiConfig.favourite.getList, {
      params
    }),
  get: (params: { targetId: string; type: number }) =>
    http.get<ApiResponse<{ id: string }>>(apiConfig.favourite.get, {
      params
    }),
  create: (body: FavouriteBodyType) =>
    http.post<ApiResponse<string>>(apiConfig.favourite.create, {
      body
    }),
  delete: (id: string) =>
    http.delete<ApiResponse<any>>(apiConfig.favourite.delete, {
      pathParams: {
        id
      }
    })
};

export default favouriteApiRequest;
