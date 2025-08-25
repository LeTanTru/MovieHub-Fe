import {
  baseSearchParamSchema,
  movieItemSearchParamSchema,
  moviePersonSearchParamSchema,
  movieSearchParamSchema,
  personSearchParamSchema,
  searchParamSchema
} from '@/schemaValidations';
import z from 'zod';

export type BaseSearchParamType = z.infer<typeof baseSearchParamSchema>;

export type SearchParamType = z.infer<typeof searchParamSchema>;

export type MovieSearchParamType = z.infer<typeof movieSearchParamSchema> &
  BaseSearchParamType;

export type MoviePersonSearchParamType = z.infer<
  typeof moviePersonSearchParamSchema
> &
  BaseSearchParamType;

export type MovieItemSearchParamType = z.infer<
  typeof movieItemSearchParamSchema
> &
  BaseSearchParamType;

export type PersonSearchParamType = z.infer<typeof personSearchParamSchema> &
  BaseSearchParamType;
