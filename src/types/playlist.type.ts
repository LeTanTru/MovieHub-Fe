import {
  playlistItemSchema,
  playlistSchema,
  removeItemSearchSchema
} from '@/schemaValidations';
import { MovieResType } from '@/types/movie.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type PlaylistResType = {
  createdDate: string;
  id: string;
  modifiedDate: string;
  name: string;
  status: number;
  totalMovie: number;
};

export type PlaylistMovieResType = MovieResType;

export type PlaylistBodyType = z.infer<typeof playlistSchema>;

export type PlaylistItemBodyType = z.infer<typeof playlistItemSchema>;

export type RemoveItemSearchType = z.infer<typeof removeItemSearchSchema>;

export type PlaylistSearchType = BaseSearchType;

type PlaylistState = {
  selectedPlaylist: PlaylistResType | null;
};

type PlaylistAction = {
  setSelectedPlaylist: (playlist: PlaylistResType | null) => void;
};

export type PlaylistStoreType = PlaylistState & PlaylistAction;

export type PlaylistIdsResType = {
  ids: string[];
};
