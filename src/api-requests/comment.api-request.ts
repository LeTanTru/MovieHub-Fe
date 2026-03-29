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

const commentApiRequest = {
  getList: (params?: CommentSearchType) =>
    http.get<ApiResponseList<CommentResType>>(apiConfig.comment.getList, {
      params
    }),
  create: (body: CommentBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.comment.create, {
      body
    }),
  delete: (id: string) =>
    http.delete<ApiResponse<any>>(apiConfig.comment.delete, {
      pathParams: { id }
    }),
  update: (body: CommentBodyType) =>
    http.put<ApiResponse<any>>(apiConfig.comment.update, {
      body
    }),
  vote: (body: VoteCommentBodyType) =>
    http.put<ApiResponse<any>>(apiConfig.comment.vote, {
      body
    }),
  getVoteList: (movieId: string) =>
    http.get<ApiResponse<CommentVoteResType[]>>(apiConfig.comment.getVoteList, {
      pathParams: { movieId }
    })
};

export default commentApiRequest;
