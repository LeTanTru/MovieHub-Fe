import { collectionSearchSchema } from '@/schemaValidations';
import { CategoryResType } from '@/types/category.type';
import { SeasonResType } from '@/types/movie.type';
import { BaseSearchType } from '@/types/search.type';
import { z } from 'zod';

export type CollectionItemResType = {
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

export type CollectionItemSearchType = z.infer<typeof collectionSearchSchema> &
  BaseSearchType;
