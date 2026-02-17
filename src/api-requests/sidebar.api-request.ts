import { apiConfig } from '@/constants';
import { ApiResponseList, SidebarResType, SidebarSearchType } from '@/types';
import { http } from '@/utils';

const sidebarApiRequest = {
  getList: (params?: SidebarSearchType) =>
    http.get<ApiResponseList<SidebarResType>>(apiConfig.sidebar.getList, {
      params
    })
};

export default sidebarApiRequest;
