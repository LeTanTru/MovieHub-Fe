import { playlistApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import {
  PlaylistBodyType,
  PlaylistItemBodyType,
  PlaylistSearchType,
  RemoveItemSearchType
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const usePlaylistMoviesQuery = ({
  playlistId,
  params
}: {
  playlistId: string;
  params?: PlaylistSearchType;
}) => {
  return useQuery({
    queryKey: [queryKeys.PLAYLIST_MOVIES, playlistId, params],
    queryFn: () => playlistApiRequest.getListMovies({ playlistId, params }),
    enabled: !!playlistId
  });
};

export const useCreatePlayListMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.PLAYLIST_CREATE],
    mutationFn: (body: PlaylistBodyType) => playlistApiRequest.create(body)
  });
};

export const useDeletePlaylistMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.PLAYLIST_DELETE],
    mutationFn: (id: string) => playlistApiRequest.delete(id)
  });
};

export const usePlaylistQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.PLAYLIST, id],
    queryFn: () => playlistApiRequest.getById(id),
    enabled: !!id
  });
};

export const usePlaylistListQuery = ({ enabled }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [queryKeys.PLAYLIST_LIST],
    queryFn: () => playlistApiRequest.getList(),
    enabled
  });
};

export const usePlaylistByMovieQuery = ({
  movieId,
  enabled
}: {
  movieId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.PLAYLIST_BY_MOVIES, movieId],
    queryFn: () => playlistApiRequest.getListByMovie(movieId),
    enabled
  });
};

export const useRemovePlaylistItemMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.PLAYLIST],
    mutationFn: (params: RemoveItemSearchType) =>
      playlistApiRequest.removeItem(params)
  });
};

export const useUpdatePlaylistMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.PLAYLIST],
    mutationFn: (body: PlaylistBodyType) => playlistApiRequest.update(body)
  });
};

export const useUpdatePlaylistItemMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.PLAYLIST_ITEM],
    mutationFn: (body: PlaylistItemBodyType) =>
      playlistApiRequest.updateItem(body)
  });
};
