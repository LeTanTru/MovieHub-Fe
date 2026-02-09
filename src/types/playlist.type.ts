import {
  playlistItemSchema,
  playlistSchema,
  playlistSearchSchema
} from '@/schemaValidations';
import { CategoryResType } from '@/types/category.type';
import { SeasonResType } from '@/types/movie.type';
import z from 'zod';

export type PlaylistResType = {
  createdDate: string;
  id: string;
  modifiedDate: string;
  name: string;
  status: number;
  totalMovie: number;
};

export type PlaylistMovieResType = {
  ageRating: number;
  averageRating: number;
  categories: CategoryResType[];
  commentCount: number;
  country: string;
  createdDate: string;
  description: string;
  duration: number;
  id: number;
  isFeatured: boolean;
  language: string;
  latestEpisode: string;
  latestSeason: string;
  modifiedDate: string;
  originalTitle: string;
  posterUrl: string;
  releaseDate: string;
  reviewCount: number;
  seasons: SeasonResType[];
  slug: string;
  status: number;
  thumbnailUrl: string;
  title: string;
  type: number;
  viewCount: number;
  year: number;
};

export type PlaylistBodyType = z.infer<typeof playlistSchema>;

export type PlaylistItemBodyType = z.infer<typeof playlistItemSchema>;

export type PlaylistSearchType = z.infer<typeof playlistSearchSchema>;

type PlaylistState = {
  selectedPlaylist: PlaylistResType | null;
};

type PlaylistActions = {
  setSelectedPlaylist: (playlist: PlaylistResType | null) => void;
};

export type PlaylistStoreType = PlaylistState & PlaylistActions;
