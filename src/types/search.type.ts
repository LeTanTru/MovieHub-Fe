import { searchSchema } from '@/schemaValidations';
import z from 'zod';

type SearchType = z.infer<typeof searchSchema>;

export type { SearchType };
