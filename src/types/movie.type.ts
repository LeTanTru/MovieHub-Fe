import { CategoryResType } from '@/types/category.type';

export type MovieResType = {
  id: number;
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
