import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseList,
  MovieHistoryResType,
  MovieNextEpisodeResType,
  MovieResType,
  MovieScheduleResType,
  MovieSearchType,
  MovieSuggestByWatchedSearchType,
  MovieSuggestByWatchedType,
  RecentWatchedCategoryResType
} from '@/types';
import { http } from '@/utils';

export const getHistoryList = (signal?: AbortSignal) =>
  http.get<ApiResponse<MovieHistoryResType[]>>(apiConfig.movie.getHistoryList, {
    signal
  });

export const getById = (id: string, signal?: AbortSignal) =>
  http.get<ApiResponse<MovieResType>>(apiConfig.movie.getById, {
    pathParams: {
      id
    },
    signal
  });

export const getList = (params?: MovieSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getList, {
    params,
    signal
  });

export const getNextEpisode = (id: string, signal?: AbortSignal) =>
  http.get<ApiResponse<MovieNextEpisodeResType>>(
    apiConfig.movie.getNextEpisode,
    {
      pathParams: {
        id
      },
      signal
    }
  );

export const getRecommendation = (signal?: AbortSignal) =>
  http.get<ApiResponse<MovieResType[]>>(apiConfig.movie.recommendation, {
    signal
  });

export const getRecommendationKNN = (signal?: AbortSignal) =>
  http.get<ApiResponseList<MovieResType>>(apiConfig.movie.recommendationKNN, {
    signal
  });

export const getRecommendationRecentWatchedCategory = (signal?: AbortSignal) =>
  http.get<ApiResponse<RecentWatchedCategoryResType>>(
    apiConfig.movie.recommendationRecentWatchedCategory,
    {
      signal
    }
  );

export const getScheduleList = (
  params: { date: string },
  signal?: AbortSignal
) =>
  http.get<ApiResponse<MovieScheduleResType[]>>(
    apiConfig.movie.getScheduleList,
    {
      params,
      signal
    }
  );

export const getSuggestByWatched = (
  params: MovieSuggestByWatchedSearchType,
  signal?: AbortSignal
) =>
  http.get<ApiResponse<MovieSuggestByWatchedType>>(
    apiConfig.movie.suggestByWatched,
    {
      params,
      signal
    }
  );

export const getSuggestionList = (id: string, signal?: AbortSignal) =>
  http.get<ApiResponse<MovieResType[]>>(apiConfig.movie.getSuggestionList, {
    pathParams: {
      id
    },
    signal
  });

export const getTopViewList = (
  params?: MovieSearchType,
  signal?: AbortSignal
) =>
  http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getTopViewList, {
    params,
    signal
  });
