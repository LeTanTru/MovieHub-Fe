import {
  reviewSchema,
  reviewSearchSchema,
  reviewVoteSchema
} from '@/schemaValidations';
import { ProfileResType } from '@/types/account.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type ReviewResType = {
  author: ProfileResType;
  content: string;
  createdDate: string;
  id: string;
  modifiedDate: string;
  movieId: string;
  rate: number;
  statistics: {
    averageRating: number;
    reviewCount: number;
  };
  status: number;
  totalDislike: number;
  totalLike: number;
};

export type ReviewVoteResType = {
  id: string;
  type: number;
};

export type ReviewBodyType = z.infer<typeof reviewSchema>;
export type ReviewVoteBodyType = z.infer<typeof reviewVoteSchema>;

export type ReviewSearchType = z.infer<typeof reviewSearchSchema> &
  BaseSearchType;
