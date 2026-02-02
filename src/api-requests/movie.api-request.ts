import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  MovieResType,
  MovieSearchType
} from '@/types';
import { http } from '@/utils';

const movieApiRequest = {
  getList: ({ params }: { params?: MovieSearchType } = {}) =>
    http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getList, {
      params
    }),
  getById: ({ id }: { id: string }) =>
    http.get<ApiResponse<MovieResType>>(apiConfig.movie.getById, {
      pathParams: {
        id
      }
    }),
  getSuggestionList: ({ id }: { id: string }) =>
    http.get<ApiResponse<MovieResType[]>>(apiConfig.movie.getSuggestionList, {
      pathParams: {
        id
      }
    })
};

export default movieApiRequest;
