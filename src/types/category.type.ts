import { categorySearchSchema } from '@/schemaValidations';
import type { BaseSearchType } from '@/types/search.type';
import { z } from 'zod';

export type CategoryResType = {
  id: string;
  status: number;
  name: string;
  slug: string;
  modifiedDate: string;
  createdDate: string;
};

type CategoryState = {
  categories: CategoryResType[];
};

type CategoryActions = {
  setCategories: (categories: CategoryResType[]) => void;
};

export type CategoryStoreType = CategoryState & CategoryActions;

export type CategorySearchType = z.infer<typeof categorySearchSchema> &
  BaseSearchType;
