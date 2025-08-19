import { apiConfig } from '@/constants';
import { ApiResponseList, MovieResType, MovieSearchType } from '@/types';
import { http } from '@/utils';

const movieApiRequest = {
  getList: async (params: MovieSearchType) =>
    await http.get<ApiResponseList<MovieResType>>(apiConfig.movie.getList, {
      params
    })
};

export default movieApiRequest;
