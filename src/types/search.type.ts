import { searchSchema } from '@/schemaValidations';
import z from 'zod';

export type SearchType = z.infer<typeof searchSchema>;
