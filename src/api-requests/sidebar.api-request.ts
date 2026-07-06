import { apiConfig } from '@/constants';
import type {
  ApiResponseList,
  SidebarResType,
  SidebarSearchType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: SidebarSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<SidebarResType>>(apiConfig.sidebar.getList, {
    params,
    signal
  });
