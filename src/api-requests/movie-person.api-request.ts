import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  MoviePersonResType,
  MoviePersonSearchParamType
} from '@/types';
import { http } from '@/utils';

const moviePersonApiRequest = {
  getList: async (params?: MoviePersonSearchParamType) =>
    await http.get<ApiResponseList<MoviePersonResType>>(
      apiConfig.moviePerson.getList,
      {
        params
      }
    )
};

export default moviePersonApiRequest;
