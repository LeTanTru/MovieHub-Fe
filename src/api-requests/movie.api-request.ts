import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  MovieResType,
  MovieSearchParamType
} from '@/types';
import { http } from '@/utils';

const movieApiRequest = {
  getList: async (params?: MovieSearchParamType) =>
    await http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getList, {
      params
    }),
  getById: async (id: string) =>
    await http.get<ApiResponse<MovieResType>>(apiConfig.movie.getById, {
      pathParams: {
        id
      }
    })
};

export default movieApiRequest;
