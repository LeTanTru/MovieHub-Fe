import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  PersonResType,
  PersonSearchType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: PersonSearchType) =>
  http.get<ApiResponseList<PersonResType>>(apiConfig.person.getList, {
    params
  });

export const getById = (id: string) =>
  http.get<ApiResponse<PersonResType>>(apiConfig.person.getById, {
    pathParams: {
      id: id
    }
  });
