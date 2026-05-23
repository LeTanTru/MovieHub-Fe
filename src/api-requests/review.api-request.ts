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

export const getList = (params?: ReviewSearchType) =>
  http.get<ApiResponseList<ReviewResType>>(apiConfig.review.getList, {
    params
  });

export const checkMovie = (movieId: string) =>
  http.get<ApiResponse<ReviewResType>>(apiConfig.review.checkMovie, {
    pathParams: { movieId }
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

export const getVoteList = (movieId: string) =>
  http.get<ApiResponse<ReviewVoteResType[]>>(apiConfig.review.getVoteList, {
    pathParams: { movieId }
  });
