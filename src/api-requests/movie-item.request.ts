import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  MovieItemResType,
  MovieItemSearchParamType
} from '@/types';
import { http } from '@/utils';

const movieItemApiRequest = {
  getList: (params?: MovieItemSearchParamType) =>
    http.get<ApiResponseList<MovieItemResType>>(apiConfig.movieItem.getList, {
      params
    })
};

export default movieItemApiRequest;
