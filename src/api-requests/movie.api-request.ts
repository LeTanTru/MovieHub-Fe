import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  MovieResType,
  MovieSearchParamType
} from '@/types';
import { http } from '@/utils';

const movieApiRequest = {
  getList: (params?: MovieSearchParamType) =>
    http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getList, {
      params
    }),
  getById: (id: string) =>
    http.get<ApiResponse<MovieResType>>(apiConfig.movie.getById, {
      pathParams: {
        id
      }
    })
};

export default movieApiRequest;
