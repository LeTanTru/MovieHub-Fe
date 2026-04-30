import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  MovieHistoryResType,
  MovieNextEpisodeResType,
  MovieResType,
  MovieScheduleResType,
  MovieSearchType,
  MovieSuggestByWatchedSearchType,
  MovieSuggestByWatchedType
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
    http.get<ApiResponse<MovieScheduleResType[]>>(
      apiConfig.movie.getScheduleList,
      {
        params
      }
    ),
  getNextEpisode: (id: string) =>
    http.get<ApiResponse<MovieNextEpisodeResType>>(
      apiConfig.movie.getNextEpisode,
      {
        pathParams: {
          id
        }
      }
    ),
  getListWatched: () =>
    http.get<ApiResponse<{ id: string; title: string }[]>>(
      apiConfig.movie.getListWatched
    ),
  getSuggestByWatched: (params: MovieSuggestByWatchedSearchType) =>
    http.get<ApiResponse<MovieSuggestByWatchedType>>(
      apiConfig.movie.suggestByWatched,
      {
        params
      }
    )
};

export default movieApiRequest;
