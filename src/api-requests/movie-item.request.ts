import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  MovieItemResType,
  MovieItemSearchType
} from '@/types';
import { http } from '@/utils';

const movieItemApiRequest = {
  getList: (params?: MovieItemSearchType) =>
    http.get<ApiResponseList<MovieItemResType>>(apiConfig.movieItem.getList, {
      params
    })
};

export default movieItemApiRequest;
