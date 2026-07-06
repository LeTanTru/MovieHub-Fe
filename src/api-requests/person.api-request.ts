import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseList,
  PersonResType,
  PersonSearchType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: PersonSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<PersonResType>>(apiConfig.person.getList, {
    params,
    signal
  });

export const getById = (id: string, signal?: AbortSignal) =>
  http.get<ApiResponse<PersonResType>>(apiConfig.person.getById, {
    pathParams: {
      id: id
    },
    signal
  });
