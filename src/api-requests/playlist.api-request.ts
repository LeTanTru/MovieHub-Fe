import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseNoData,
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
  params?: PlaylistSearchType,
  signal?: AbortSignal
) =>
  http.get<ApiResponseList<PlaylistMovieResType>>(
    apiConfig.playlist.getListMovies,
    {
      pathParams: { id: playlistId },
      params,
      signal
    }
  );

export const create = (body: PlaylistBodyType) =>
  http.post<ApiResponseList<PlaylistBodyType>>(apiConfig.playlist.create, {
    body
  });

export const deleteById = (id: string) =>
  http.delete<ApiResponseNoData>(apiConfig.playlist.delete, {
    pathParams: { id }
  });

export const getList = (signal?: AbortSignal) =>
  http.get<ApiResponse<PlaylistResType[]>>(apiConfig.playlist.getList, {
    signal
  });

export const getListByMovie = (movieId: string, signal?: AbortSignal) =>
  http.get<ApiResponse<PlaylistIdsResType>>(apiConfig.playlist.getListByMovie, {
    pathParams: { movieId },
    signal
  });

export const removeItem = (params: RemoveItemSearchType) =>
  http.delete<ApiResponseNoData>(apiConfig.playlist.removeItem, {
    params
  });

export const update = (body: PlaylistBodyType) =>
  http.put<ApiResponseNoData>(apiConfig.playlist.update, {
    body
  });

export const updateItem = (body: PlaylistItemBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.playlist.updateItem, {
    body
  });
