import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  PersonResType,
  PersonSearchType
} from '@/types';
import { http } from '@/utils';

const personApiRequest = {
  getList: (params?: PersonSearchType) =>
    http.get<ApiResponseList<PersonResType>>(apiConfig.person.getList, {
      params
    }),
  getById: (id: string) =>
    http.get<ApiResponse<PersonResType>>(apiConfig.person.getById, {
      pathParams: {
        id: id
      }
    })
};

export default personApiRequest;
