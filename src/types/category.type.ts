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

type CategoryAction = {
  setCategories: (categories: CategoryResType[]) => void;
};

export type CategoryStoreType = CategoryState & CategoryAction;

export type CategorySearchType = z.infer<typeof categorySearchSchema> &
  BaseSearchType;
