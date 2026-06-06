import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  MoviePersonResType,
  MoviePersonSearchType
} from '@/types';
import { http } from '@/utils';

export const getList = (params?: MoviePersonSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<MoviePersonResType>>(apiConfig.moviePerson.getList, {
    params,
    signal
  });
