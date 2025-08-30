import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  MovieSearchParamType,
  PersonResType
} from '@/types';
import { http } from '@/utils';

const personApiRequest = {
  getList: async (params?: MovieSearchParamType) =>
    await http.get<ApiResponseList<PersonResType>>(apiConfig.person.getList, {
      params
    }),
  getById: async ({ id }: { id: number }) =>
    await http.get<ApiResponse<PersonResType>>(apiConfig.person.getById, {
      pathParams: {
        id: id
      }
    })
};

export default personApiRequest;
