import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  PlaylistBodyType,
  PlaylistItemBodyType,
  PlaylistMovieResType,
  PlaylistResType,
  PlaylistSearchType
} from '@/types';
import { http } from '@/utils';

const playlistApiRequest = {
  getListMovies: (movieId: string) =>
    http.get<ApiResponseList<PlaylistMovieResType>>(
      apiConfig.playlist.getListMovies,
      {
        pathParams: { movieId }
      }
    ),
  create: (body: PlaylistBodyType) =>
    http.post<ApiResponseList<PlaylistBodyType>>(apiConfig.playlist.create, {
      body
    }),
  delete: (id: string) =>
    http.delete<ApiResponseList<PlaylistMovieResType>>(
      apiConfig.playlist.delete,
      {
        pathParams: { id }
      }
    ),
  getById: (id: string) =>
    http.get<ApiResponseList<PlaylistMovieResType>>(
      apiConfig.playlist.getById,
      {
        pathParams: { id }
      }
    ),
  getList: () =>
    http.get<ApiResponse<PlaylistResType[]>>(apiConfig.playlist.getList),
  getListByMovie: (movieId: string) =>
    http.get<ApiResponseList<number[]>>(apiConfig.playlist.getListByMovie, {
      pathParams: { id: movieId }
    }),
  removeItem: (params: PlaylistSearchType) =>
    http.delete<ApiResponseList<PlaylistMovieResType>>(
      apiConfig.playlist.removeItem,
      {
        params
      }
    ),
  update: (body: PlaylistBodyType) =>
    http.put<ApiResponseList<PlaylistMovieResType>>(apiConfig.playlist.update, {
      body
    }),
  updateItem: (body: PlaylistItemBodyType) =>
    http.put<ApiResponseList<PlaylistMovieResType>>(
      apiConfig.playlist.updateItem,
      {
        body
      }
    )
};

export default playlistApiRequest;
