import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseList,
  ApiResponseNoData,
  ReviewBodyType,
  ReviewResType,
  ReviewSearchType,
  ReviewVoteBodyType,
  ReviewVoteResType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: ReviewSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<ReviewResType>>(apiConfig.review.getList, {
    params,
    signal
  });

export const checkMovie = (movieId: string, signal?: AbortSignal) =>
  http.get<ApiResponse<ReviewResType>>(apiConfig.review.checkMovie, {
    pathParams: { movieId },
    signal
  });

export const create = (body: ReviewBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.review.create, {
    body
  });

export const deleteById = (id: string) =>
  http.delete<ApiResponseNoData>(apiConfig.review.delete, {
    pathParams: { id }
  });

export const vote = (body: ReviewVoteBodyType) =>
  http.patch<ApiResponseNoData>(apiConfig.review.vote, {
    body
  });

export const getVoteList = (movieId: string, signal?: AbortSignal) =>
  http.get<ApiResponse<ReviewVoteResType[]>>(apiConfig.review.getVoteList, {
    pathParams: { movieId },
    signal
  });
