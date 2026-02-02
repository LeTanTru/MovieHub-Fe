import { apiConfig } from '@/constants';
import { ApiResponseList, CommentResType, CommentSearchType } from '@/types';
import { http } from '@/utils';

const commentApiRequest = {
  getList: ({ params }: { params?: CommentSearchType }) =>
    http.get<ApiResponseList<CommentResType>>(apiConfig.review.getList, {
      params
    })
};

export default commentApiRequest;
