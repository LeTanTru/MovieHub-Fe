import { apiConfig } from '@/constants';
import { ApiResponseList, MovieItemSearchParamType } from '@/types';
import { MovieItemResType } from '@/types/movie-item.type';
import { http } from '@/utils';

const movieItemApiRequest = {
  getList: (params?: MovieItemSearchParamType) =>
    http.get<ApiResponseList<MovieItemResType>>(apiConfig.movieItem.getList, {
      params
    })
};

export default movieItemApiRequest;
