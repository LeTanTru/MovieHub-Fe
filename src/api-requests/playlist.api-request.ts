import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  PlaylistBodyType,
  PlaylistIdsResType,
  PlaylistItemBodyType,
  PlaylistMovieResType,
  PlaylistResType,
  PlaylistSearchType,
  RemoveItemSearchType
} from '@/types';
import { http } from '@/utils';

const playlistApiRequest = {
  getListMovies: (playlistId: string, params?: PlaylistSearchType) =>
    http.get<ApiResponseList<PlaylistMovieResType>>(
      apiConfig.playlist.getListMovies,
      {
        pathParams: { id: playlistId },
        params
      }
    ),
  create: (body: PlaylistBodyType) =>
    http.post<ApiResponseList<PlaylistBodyType>>(apiConfig.playlist.create, {
      body
    }),
  delete: (id: string) =>
    http.delete<ApiResponseList<any>>(apiConfig.playlist.delete, {
      pathParams: { id }
    }),
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
    http.get<ApiResponse<PlaylistIdsResType>>(
      apiConfig.playlist.getListByMovie,
      {
        pathParams: { movieId }
      }
    ),
  removeItem: (params: RemoveItemSearchType) =>
    http.delete<ApiResponseList<any>>(apiConfig.playlist.removeItem, {
      params
    }),
  update: (body: PlaylistBodyType) =>
    http.put<ApiResponseList<any>>(apiConfig.playlist.update, {
      body
    }),
  updateItem: (body: PlaylistItemBodyType) =>
    http.post<ApiResponseList<any>>(apiConfig.playlist.updateItem, {
      body
    })
};

export default playlistApiRequest;
