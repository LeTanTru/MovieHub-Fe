import { categorySearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import { z } from 'zod';

export type CategoryResType = {
  id: string;
  status: number;
  name: string;
  slug: string;
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
