import { collectionSearchSchema } from '@/schemaValidations';
import { CollectionItemResType } from '@/types/collection-item.type';
import { MovieResType } from '@/types/movie.type';
import { BaseSearchType } from '@/types/search.type';
import { StyleResType } from '@/types/style.type';
import { z } from 'zod';

export type CollectionResType = {
  collectionItems: CollectionItemResType[];
  color: string;
  createdDate: string;
  filter: string;
  id: string;
  modifiedDate: string;
  movies: MovieResType[];
  name: string;
  ordering: number;
  status: number;
  style: StyleResType;
  styleType: number;
  type: number;
};

export type CollectionSearchType = z.infer<typeof collectionSearchSchema> &
  BaseSearchType;
