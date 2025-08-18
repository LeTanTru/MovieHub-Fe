import { apiConfig } from '@/constants';
import { ApiResponseList, PersonResType } from '@/types';
import http from '@/utils/http.util';

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
    })
};

export default personApiRequest;
