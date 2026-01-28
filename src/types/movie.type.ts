import { movieSearchSchema } from '@/schemaValidations';
import { CategoryResType } from '@/types/category.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type MovieResType = {
  id: string;
  status: number;
  modifiedDate: string;
  createdDate: string;
  title: string;
  originalTitle: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  posterUrl: string;
  releaseDate: string;
  type: number;
  isFeatured: boolean;
  language: string;
  country: string;
  ageRating: number;
  categories: CategoryResType[];
  viewCount: number;
};

export type MovieSearchType = z.infer<typeof movieSearchSchema> &
  BaseSearchType;
