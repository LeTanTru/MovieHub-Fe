import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  MovieHistoryResType,
  MovieResType,
  MovieSearchType
} from '@/types';
import { http } from '@/utils';

const movieApiRequest = {
  getList: (params?: MovieSearchType) =>
    http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getList, {
      params
    }),
  getById: (id: string) =>
    http.get<ApiResponse<MovieResType>>(apiConfig.movie.getById, {
      pathParams: {
        id
      }
    }),
  getSuggestionList: (id: string) =>
    http.get<ApiResponse<MovieResType[]>>(apiConfig.movie.getSuggestionList, {
      pathParams: {
        id
      }
    }),
  getHistoryList: () =>
    http.get<ApiResponse<MovieHistoryResType[]>>(
      apiConfig.movie.getHistoryList
    ),
  getTopViewList: (params?: MovieSearchType) =>
    http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getTopViewList, {
      params
    }),
  getScheduleList: (params: { date: string }) =>
    http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getScheduleList, {
      params
    })
};

export default movieApiRequest;
