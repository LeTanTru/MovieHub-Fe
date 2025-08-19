import { apiConfig } from '@/constants';
import { ApiResponseList, CategoryResType } from '@/types';
import { http } from '@/utils';

const categoryApiRequest = {
  getList: async () =>
    await http.get<ApiResponseList<CategoryResType>>(apiConfig.category.getList)
};

export default categoryApiRequest;
