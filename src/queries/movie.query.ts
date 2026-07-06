import { movieApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import type { MovieSearchType, MovieSuggestByWatchedSearchType } from '@/types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useMovieHistoryListQuery = ({
  enabled
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_HISTORY],
    queryFn: ({ signal }) => movieApiRequest.getHistoryList(signal),
    enabled,
    select: (data) => data.data
  });
};

export const useMovieQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE, id],
    queryFn: ({ signal }) => movieApiRequest.getById(id, signal),
    enabled: !!id
  });
};

export const useMovieListQuery = ({
  params = {},
  enabled = false,
  isKeepPreviousData = false
}: {
  params?: MovieSearchType;
  enabled?: boolean;
  isKeepPreviousData?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_LIST, params],
    queryFn: ({ signal }) => movieApiRequest.getList(params, signal),
    enabled,
    placeholderData: isKeepPreviousData ? keepPreviousData : undefined,
    select: (data) => data.data
  });
};

export const useMovieNextEpisodeQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_NEXT_EPISODE, id],
    queryFn: ({ signal }) => movieApiRequest.getNextEpisode(id, signal),
    enabled: !!id,
    select: (data) => data.data
  });
};

export const useMovieRecommendationQuery = ({
  enabled
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_RECOMMENDATION],
    queryFn: ({ signal }) => movieApiRequest.getRecommendation(signal),
    enabled,
    select: (data) => data.data
  });
};

export const useMovieRecommendationKNNQuery = ({
  enabled
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_RECOMMENDATION_KNN],
    queryFn: ({ signal }) => movieApiRequest.getRecommendationKNN(signal),
    enabled,
    select: (data) => data.data
  });
};

export const useMovieRecommendationRecentWatchedCategoryQuery = ({
  enabled
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_RECOMMENDATION_RECENT_WATCHED_CATEGORY],
    queryFn: ({ signal }) =>
      movieApiRequest.getRecommendationRecentWatchedCategory(signal),
    enabled,
    select: (data) => data.data
  });
};

export const useScheduleMovieListQuery = ({
  params,
  enabled
}: {
  params: { date: string };
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_SCHEDULE_LIST, params],
    queryFn: ({ signal }) => movieApiRequest.getScheduleList(params, signal),
    enabled,
    select: (data) => data.data
  });
};

export const useMovieSuggestByWatchedQuery = ({
  params = {},
  enabled
}: {
  params?: MovieSuggestByWatchedSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [`${queryKeys.SUGGEST_BY_WATCHED}-${params.page}`, params],
    queryFn: ({ signal }) =>
      movieApiRequest.getSuggestByWatched(params, signal),
    enabled,
    select: (data) => data.data
  });
};

export const useSuggestionMovieListQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_SUGGESTION_LIST, id],
    queryFn: ({ signal }) => movieApiRequest.getSuggestionList(id, signal),
    enabled: !!id,
    select: (data) => data.data
  });
};

export const useTopViewMovieListQuery = ({
  params = {},
  enabled
}: {
  params?: MovieSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_TOP_VIEW_LIST, params],
    queryFn: ({ signal }) => movieApiRequest.getTopViewList(params, signal),
    enabled,
    select: (data) => data.data
  });
};
