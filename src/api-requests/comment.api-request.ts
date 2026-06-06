import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseList,
  CommentResType,
  CommentSearchType,
  CommentVoteResType,
  CommentBodyType,
  VoteCommentBodyType,
  ApiResponseNoData
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: CommentSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<CommentResType>>(apiConfig.comment.getList, {
    params,
    signal
  });

export const create = (body: CommentBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.comment.create, {
    body
  });

export const deleteById = (id: string) =>
  http.delete<ApiResponseNoData>(apiConfig.comment.delete, {
    pathParams: { id }
  });

export const update = (body: CommentBodyType) =>
  http.put<ApiResponseNoData>(apiConfig.comment.update, {
    body
  });

export const vote = (body: VoteCommentBodyType) =>
  http.put<ApiResponseNoData>(apiConfig.comment.vote, {
    body
  });

export const getVoteList = (movieId: string, signal?: AbortSignal) =>
  http.get<ApiResponse<CommentVoteResType[]>>(apiConfig.comment.getVoteList, {
    pathParams: { movieId },
    signal
  });
