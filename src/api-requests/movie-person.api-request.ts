import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  MoviePersonResType,
  MoviePersonSearchType
} from '@/types';
import { http } from '@/utils';

const moviePersonApiRequest = {
  getList: async ({ personId, kind }: MoviePersonSearchType) =>
    await http.get<ApiResponseList<MoviePersonResType>>(
      apiConfig.moviePerson.getList,
      {
        params: {
          personId,
          kind
        }
      }
    )
};

export default moviePersonApiRequest;
