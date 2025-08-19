import { apiConfig } from '@/constants';
import { ApiResponse, ApiResponseList, PersonResType } from '@/types';
import { http } from '@/utils';

const personApiRequest = {
  getList: async ({
    page,
    size = 20
  }: {
    page?: string | number;
    size?: string | number;
  }) =>
    await http.get<ApiResponseList<PersonResType>>(apiConfig.person.getList, {
      params: {
        page,
        size
      }
    }),
  getById: async ({ id }: { id: number }) =>
    await http.get<ApiResponse<PersonResType>>(apiConfig.person.getById, {
      pathParams: {
        id: id
      }
    })
};

export default personApiRequest;
