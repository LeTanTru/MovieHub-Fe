import movieApiRequest from '@/api-requests/movie.api-request';
import { ApiResponse, MovieResType } from '@/types';
import { cache } from 'react';

export const getMovieDetail = cache(
  async (id: string): Promise<ApiResponse<MovieResType>> => {
    return await movieApiRequest.getById(id);
  }
);
