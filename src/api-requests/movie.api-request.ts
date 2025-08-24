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
  getBySlug: async (slug: string) =>
    await http.get<ApiResponse<MovieResType>>(apiConfig.movie.getBySlug, {
      pathParams: {
        slug
      }
    })
};

export default movieApiRequest;
