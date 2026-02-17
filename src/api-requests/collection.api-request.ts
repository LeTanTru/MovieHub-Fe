import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CollectionResType,
  CollectionSearchType
} from '@/types';
import { http } from '@/utils';

const collectionApiRequest = {
  getTopicList: (params?: CollectionSearchType) =>
    http.get<ApiResponseList<CollectionResType>>(
      apiConfig.collection.getTopicList,
      {
        params
      }
    ),
  getById: (id: string) =>
    http.get<ApiResponse<CollectionResType>>(apiConfig.collection.getById, {
      pathParams: {
        id
      }
    })
};

export default collectionApiRequest;
