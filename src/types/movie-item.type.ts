import { movieItemSearchSchema } from '@/schemaValidations';
import type { EpisodeResType, MovieResType } from '@/types/movie.type';
import type { BaseSearchType } from '@/types/search.type';
import { VideoResType } from '@/types/video.type';
import { z } from 'zod';

export type MovieItemResType = {
  createdDate: string;
  description: string;
  episodes?: EpisodeResType[];
  id: string;
  kind: number;
  label: string;
  modifiedDate: string;
  movie: MovieResType;
  ordering: number;
  releaseDate: string;
  status: number;
  thumbnailUrl: string;
  title: string;
  video: VideoResType;
  parent: {
    id: string;
    kind: number;
    label: string;
  };
  totalEpisode: number;
};

export type MovieItemSearchType = z.infer<typeof movieItemSearchSchema> &
  BaseSearchType;
