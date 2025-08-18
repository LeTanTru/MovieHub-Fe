import { apiConfig } from '@/constants';
import { ApiResponseList, PersonResType } from '@/types';
import http from '@/utils/http.util';

const personApiRequest = {
  getList: async () =>
    await http.get<ApiResponseList<PersonResType>>(apiConfig.person.getList)
};

export default personApiRequest;
