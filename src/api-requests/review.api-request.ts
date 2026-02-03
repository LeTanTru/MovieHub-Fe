import { apiConfig } from '@/constants';
import { ApiResponseList, ReviewResType, ReviewSearchType } from '@/types';
import { http } from '@/utils';

const reviewApiRequest = {
  getList: ({ params }: { params?: ReviewSearchType }) =>
    http.get<ApiResponseList<ReviewResType>>(apiConfig.review.getList, {
      params
    })
};

export default reviewApiRequest;
