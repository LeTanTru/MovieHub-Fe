import { baseSearchSchema, searchSchema } from '@/schemaValidations';
import { MovieSearchType } from '@/types/movie.type';
import { z } from 'zod';

export type BaseSearchType = z.infer<typeof baseSearchSchema>;

export type SearchType = z.infer<typeof searchSchema>;

export type SearchKeys = keyof MovieSearchType;

export type SearchParamsType = MovieSearchType & { page?: string };

type SearchState = {
  keyword: string;
};

type SearchAction = {
  setKeyword: (keyword: string) => void;
};

export type SearchStore = SearchState & SearchAction;
