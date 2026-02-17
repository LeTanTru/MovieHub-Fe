import { sidebarSearchSchema } from '@/schemaValidations';
import { MovieResType } from '@/types/movie.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type SidebarResType = {
  active: boolean;
  createdDate: string;
  description: string;
  id: string;
  mainColor: string;
  mobileThumbnailUrl: string;
  modifiedDate: string;
  movie: MovieResType;
  ordering: number;
  status: number;
  webThumbnailUrl: string;
};

export type SidebarSearchType = z.infer<typeof sidebarSearchSchema> &
  BaseSearchType;
