import { baseSearchSchema, searchSchema } from '@/schemaValidations';
import { z } from 'zod';

export type BaseSearchType = z.infer<typeof baseSearchSchema>;

export type SearchType = z.infer<typeof searchSchema>;
