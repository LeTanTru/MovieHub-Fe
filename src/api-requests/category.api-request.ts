import { apiConfig, MAX_PAGE_SIZE } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CategoryResType,
  CategorySearchType
} from '@/types';
import { http } from '@/utils';

const categoryApiRequest = {
  getList: (params?: CategorySearchType) =>
    http.get<ApiResponseList<CategoryResType>>(apiConfig.category.getList, {
      params: {
        size: MAX_PAGE_SIZE,
        ...params
      }
    }),
  getById: (id: string) =>
    http.get<ApiResponse<CategoryResType>>(apiConfig.category.getById, {
      pathParams: {
        id
      }
    })
};

export default categoryApiRequest;
