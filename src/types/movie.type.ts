import { movieSearchSchema } from '@/schemaValidations';
import type { CategoryResType } from '@/types/category.type';
import type { MovieItemResType } from '@/types/movie-item.type';
import type { MoviePersonResType } from '@/types/movie-person.type';
import type { BaseSearchType } from '@/types/search.type';
import type { VideoResType } from '@/types/video.type';
import { z } from 'zod';

export type MetadataType = {
  latestSeason: {
    id: string;
    title: string;
    kind: number;
    label: string;
    releaseDate: string;
  };
  latestEpisode: {
    id: string;
    title: string;
    kind: number;
    label: string;
    releaseDate: string;
  };
  duration: number;
};

export type EpisodeResType = {
  id: string;
  title: string;
  description: string;
  kind: number;
  label: string;
  ordering: number;
  parent: { id: string; kind: number; label: string };
  video: VideoResType;
  releaseDate: string;
  thumbnailUrl: string;
};

export type SeasonResType = {
  createdDate: string;
  description: string;
  episodes: EpisodeResType[];
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
  trailer: {
    id: string;
    title: string;
    description: string;
    kind: number;
    label: string;
    ordering: number;
    parent: {
      id: string;
      kind: number;
      label: string;
    };
    video: VideoResType;
    releaseDate: string;
    thumbnailUrl: string;
  };
  totalEpisode: number;
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
  imageTitleUrl: string;
  imdbId: string;
  imdbRating: number;
  isFeatured: boolean;
  language: string;
  metadata: string;
  modifiedDate: string;
  originalTitle: string;
  posterUrl: string;
  releaseDate: string;
  reviewCount: number;
  seasons: SeasonResType[] | null;
  slug: string;
  status: number;
  thumbnailUrl: string;
  title: string;
  type: number;
  viewCount: number;
  year: number;
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

export type MovieSearchType = z.infer<typeof movieSearchSchema> &
  BaseSearchType;

export type MovieScheduleResType = {
  id: string;
  title: string;
  description: string;
  kind: number;
  label: string;
  ordering: number;
  movie: MovieResType;
  releaseDate: string;
  thumbnailUrl: string;
  totalEpisode: number;
};

export type MovieNextEpisodeResType = {
  id: string;
  title: string;
  kind: number;
  label: string;
  releaseDate: string;
};

export type MovieSuggestByWatchedType = {
  suggestedMovies: MovieResType[];
  watchedMovie: {
    id: string;
    title: string;
  };
};

export type RecentWatchedCategoryResType = {
  category: CategoryResType;
  movies: MovieResType[];
};

export type MovieSuggestByWatchedSearchType = BaseSearchType;

type MovieState = {
  movie: MovieResType | null;
  movieItem: MovieItemResType | null;

  movies: MovieResType[];
  movieItems: MovieItemResType[];
  moviePerson: MoviePersonResType[];

  selectedSeason: string;

  discussionTab: string;
};

type MovieActions = {
  setMovie: (movie?: MovieResType | null) => void;
  setMovieItem: (movieItem?: MovieItemResType | null) => void;

  setMovies: (movies: MovieResType[]) => void;
  setMovieItems: (movieItems: MovieItemResType[]) => void;
  setMoviePerson: (moviePerson: MoviePersonResType[]) => void;

  setSelectedSeason: (season: string) => void;

  setDiscussionTab: (tab: string) => void;
};

export type MovieStoreType = MovieState & MovieActions;
