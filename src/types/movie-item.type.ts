import { movieItemSearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import { VideoResType } from '@/types/video.type';
import z from 'zod';

export type MovieItemResType = {
  id: string;
  status: number;
  title: string;
  kind: number;
  ordering: number;
  video: VideoResType;
  releaseDate: string;
};

export type MovieItemSearchType = z.infer<typeof movieItemSearchSchema> &
  BaseSearchType;
