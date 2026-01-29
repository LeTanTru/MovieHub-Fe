import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  CollectionResType,
  CollectionSearchType
} from '@/types';
import { http } from '@/utils';

const collectionApiRequest = {
  getList: async (params?: CollectionSearchType) =>
    http.get<ApiResponseList<CollectionResType>>(apiConfig.collection.getList, {
      params
    })
};

export default collectionApiRequest;
