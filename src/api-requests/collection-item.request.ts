import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  CollectionItemResType,
  CollectionItemSearchType
} from '@/types';
import { http } from '@/utils';

const collectionItemApiRequest = {
  getList: (params?: CollectionItemSearchType) =>
    http.get<ApiResponseList<CollectionItemResType>>(
      apiConfig.collectionItem.getList,
      {
        params
      }
    )
};

export default collectionItemApiRequest;
