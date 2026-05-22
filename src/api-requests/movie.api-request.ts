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

export const getList = (params?: MovieSearchType) =>
  http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getList, {
    params
  });

export const getById = (id: string) =>
  http.get<ApiResponse<MovieResType>>(apiConfig.movie.getById, {
    pathParams: {
      id
    }
  });

export const getSuggestionList = (id: string) =>
  http.get<ApiResponse<MovieResType[]>>(apiConfig.movie.getSuggestionList, {
    pathParams: {
      id
    }
  });

export const getHistoryList = () =>
  http.get<ApiResponse<MovieHistoryResType[]>>(apiConfig.movie.getHistoryList);

export const getTopViewList = (params?: MovieSearchType) =>
  http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getTopViewList, {
    params
  });

export const getScheduleList = (params: { date: string }) =>
  http.get<ApiResponse<MovieScheduleResType[]>>(
    apiConfig.movie.getScheduleList,
    {
      params
    }
  );

export const getNextEpisode = (id: string) =>
  http.get<ApiResponse<MovieNextEpisodeResType>>(
    apiConfig.movie.getNextEpisode,
    {
      pathParams: {
        id
      }
    }
  );

export const getSuggestByWatched = (params: MovieSuggestByWatchedSearchType) =>
  http.get<ApiResponse<MovieSuggestByWatchedType>>(
    apiConfig.movie.suggestByWatched,
    {
      params
    }
  );

export const getRecommendation = () =>
  http.get<ApiResponse<MovieResType[]>>(apiConfig.movie.recommendation);
