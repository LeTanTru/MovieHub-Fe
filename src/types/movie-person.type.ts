import { moviePersonSearchSchema } from '@/schemaValidations';
import { CategoryResType } from '@/types/category.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

type MovieType = {
  id: string;
  title: string;
  originalTitle: string;
  slug: string;
  thumbnailUrl: string;
  posterUrl: string;
  type: number;
  releaseDate: string;
  ageRating: string;
  categories: CategoryResType[];
};

type PersonType = {
  id: string;
  name: string;
  otherName: string;
  avatarPath: string;
  country: string;
  kinds: number[];
};

export type MoviePersonResType = {
  id: string;
  status: number;
  modifiedDate: string;
  createdDate: string;
  movie: MovieType;
  person: PersonType;
  kind: number;
  characterName: string;
  ordering: number;
};

export type MoviePersonSearchType = z.infer<typeof moviePersonSearchSchema> &
  BaseSearchType;
