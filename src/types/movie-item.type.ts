import { movieItemSearchSchema } from '@/schemaValidations';
import { MovieResType } from '@/types/movie.type';
import { BaseSearchType } from '@/types/search.type';
import { VideoResType } from '@/types/video.type';
import { z } from 'zod';

export type MovieItemResType = {
  createdDate: string;
  description: string;
  episodes: any[];
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
};

export type MovieItemSearchType = z.infer<typeof movieItemSearchSchema> &
  BaseSearchType;
