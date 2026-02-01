import { styleSearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import { z } from 'zod';

export type StyleResType = {
  createdDate: string;
  description: string;
  id: string;
  imageUrl: string;
  isDefault: boolean;
  modifiedDate: string;
  name: string;
  status: number;
  type: number;
};

export type StyleSearchType = z.infer<typeof styleSearchSchema> &
  BaseSearchType;
