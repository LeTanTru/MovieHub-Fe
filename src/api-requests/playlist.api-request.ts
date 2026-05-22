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

export const getListMovies = (
  playlistId: string,
  params?: PlaylistSearchType
) =>
  http.get<ApiResponseList<PlaylistMovieResType>>(
    apiConfig.playlist.getListMovies,
    {
      pathParams: { id: playlistId },
      params
    }
  );

export const create = (body: PlaylistBodyType) =>
  http.post<ApiResponseList<PlaylistBodyType>>(apiConfig.playlist.create, {
    body
  });

export const deleteById = (id: string) =>
  http.delete<ApiResponseList<any>>(apiConfig.playlist.delete, {
    pathParams: { id }
  });

export const getList = () =>
  http.get<ApiResponse<PlaylistResType[]>>(apiConfig.playlist.getList);

export const getListByMovie = (movieId: string) =>
  http.get<ApiResponse<PlaylistIdsResType>>(apiConfig.playlist.getListByMovie, {
    pathParams: { movieId }
  });

export const removeItem = (params: RemoveItemSearchType) =>
  http.delete<ApiResponseList<any>>(apiConfig.playlist.removeItem, {
    params
  });

export const update = (body: PlaylistBodyType) =>
  http.put<ApiResponseList<any>>(apiConfig.playlist.update, {
    body
  });

export const updateItem = (body: PlaylistItemBodyType) =>
  http.post<ApiResponseList<any>>(apiConfig.playlist.updateItem, {
    body
  });
