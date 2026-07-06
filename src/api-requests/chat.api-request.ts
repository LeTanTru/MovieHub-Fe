import { apiConfig } from '@/constants';
import type { ApiResponseList, ChatResType, ChatSearchType } from '@/types';
import { http } from '@/utils';

export const getList = (params?: ChatSearchType) =>
  http.get<ApiResponseList<ChatResType>>(apiConfig.chat.getList, { params });
