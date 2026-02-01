import { movieSearchSchema } from '@/schemaValidations';
import { CategoryResType } from '@/types/category.type';
import { MovieItemResType } from '@/types/movie-item.type';
import { BaseSearchType } from '@/types/search.type';
import { VideoResType } from '@/types/video.type';
import { z } from 'zod';

export type SeasonResType = {
  createdDate: string;
  description: string;
  episodes: any[];
  id: string;
  kind: number;
  label: string;
  modifiedDate: string;
  ordering: number;
  releaseDate: string;
  status: number;
  thumbnailUrl: string;
  title: string;
  video: VideoResType;
};

export type MovieResType = {
  ageRating: number;
  averageRating: number;
  categories: CategoryResType[];
  commentCount: number;
  country: string;
  createdDate: string;
  description: string;
  id: string;
  isFeatured: boolean;
  language: string;
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
};

export type MovieHistoryResType = {
  createdDate: string;
  id: string;
  isCompleted: boolean;
  lastWatchSeconds: number;
  modifiedDate: string;
  movie: MovieResType;
  movieId: string;
  movieItem: MovieItemResType;
  movieItemId: string;
  status: number;
  timesWatched: number;
  userId: string;
};

export type MovieTopViewsResType = {
  ageRating: number;
  averageRating: number;
  categories: CategoryResType[];
  commentCount: number;
  country: string;
  createdDate: string;
  description: string;
  id: string;
  isFeatured: boolean;
  language: string;
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
};

export type MovieSearchType = z.infer<typeof movieSearchSchema> &
  BaseSearchType;
