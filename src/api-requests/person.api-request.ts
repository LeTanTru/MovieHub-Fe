import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  MovieSearchType,
  PersonResType
} from '@/types';
import { http } from '@/utils';

const personApiRequest = {
  getList: ({ params }: { params?: MovieSearchType } = {}) =>
    http.get<ApiResponseList<PersonResType>>(apiConfig.person.getList, {
      params
    }),
  getById: ({ id }: { id: number }) =>
    http.get<ApiResponse<PersonResType>>(apiConfig.person.getById, {
      pathParams: {
        id: id
      }
    })
};

export default personApiRequest;
