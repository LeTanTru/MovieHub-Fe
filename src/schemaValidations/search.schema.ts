import { z } from 'zod';

export const baseSearchParamSchema = z.object({
  page: z.union([z.number(), z.string()]).optional(),
  size: z.union([z.number(), z.string()]).optional()
});

export const searchParamSchema = z.object({
  title: z.string().optional()
});

export const movieSearchParamSchema = z.object({
  ageRating: z.number().optional(),
  originalTitle: z.string().optional(),
  title: z.string().optional(),
  type: z.number().optional()
});

export const moviePersonSearchParamSchema = z.object({
  id: z.number().optional(),
  kind: z.number().optional(),
  movieId: z.number().optional(),
  personId: z.number().optional()
});

export const movieItemSearchParamSchema = z.object({
  id: z.number().optional(),
  kind: z.number().optional(),
  movieId: z.number().optional(),
  parentId: z.number().optional(),
  title: z.string().optional()
});

export const personSearchParamSchema = z.object({
  id: z.number().optional(),
  country: z.string().optional(),
  gender: z.number().optional(),
  kind: z.number().optional(),
  movieId: z.number().optional(),
  name: z.string().optional(),
  otherName: z.string().optional()
});
