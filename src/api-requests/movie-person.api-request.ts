import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  MoviePersonResType,
  MoviePersonSearchType
} from '@/types';
import { http } from '@/utils';

const moviePersonApiRequest = {
  getList: ({ params }: { params?: MoviePersonSearchType }) =>
    http.get<ApiResponseList<MoviePersonResType>>(
      apiConfig.moviePerson.getList,
      {
        params
      }
    )
};

export default moviePersonApiRequest;
