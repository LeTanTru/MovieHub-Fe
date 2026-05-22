import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CommentResType,
  CommentSearchType,
  CommentVoteResType,
  CommentBodyType,
  VoteCommentBodyType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: CommentSearchType) =>
  http.get<ApiResponseList<CommentResType>>(apiConfig.comment.getList, {
    params
  });

export const create = (body: CommentBodyType) =>
  http.post<ApiResponse<any>>(apiConfig.comment.create, {
    body
  });

export const deleteById = (id: string) =>
  http.delete<ApiResponse<any>>(apiConfig.comment.delete, {
    pathParams: { id }
  });

export const update = (body: CommentBodyType) =>
  http.put<ApiResponse<any>>(apiConfig.comment.update, {
    body
  });

export const vote = (body: VoteCommentBodyType) =>
  http.put<ApiResponse<any>>(apiConfig.comment.vote, {
    body
  });

export const getVoteList = (movieId: string) =>
  http.get<ApiResponse<CommentVoteResType[]>>(apiConfig.comment.getVoteList, {
    pathParams: { movieId }
  });
