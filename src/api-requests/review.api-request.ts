import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  ReviewBodyType,
  ReviewResType,
  ReviewSearchType,
  ReviewVoteBodyType,
  ReviewVoteResType
} from '@/types';
import { http } from '@/utils';

const reviewApiRequest = {
  getList: ({ params }: { params?: ReviewSearchType }) =>
    http.get<ApiResponseList<ReviewResType>>(apiConfig.review.getList, {
      params
    }),
  checkMovie: (movieId: string) =>
    http.get<ApiResponse<ReviewResType>>(apiConfig.review.checkMovie, {
      pathParams: { movieId }
    }),
  create: (body: ReviewBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.review.create, {
      body
    }),
  delete: (id: string) =>
    http.delete<ApiResponse<any>>(apiConfig.review.delete, {
      pathParams: { id }
    }),
  vote: (body: ReviewVoteBodyType) =>
    http.patch<ApiResponse<any>>(apiConfig.review.vote, {
      body
    }),
  getVoteList: (movieId: string) =>
    http.get<ApiResponse<ReviewVoteResType[]>>(apiConfig.review.getVoteList, {
      pathParams: { movieId }
    })
};

export default reviewApiRequest;
